import { BeforeAll, AfterAll, Before, setDefaultTimeout } from '@cucumber/cucumber';
import { GenericContainer, Wait } from 'testcontainers';
import oracledb from 'oracledb';
import fs from 'node:fs/promises';
import path from 'node:path';
import oracleDBInstance from '../../src/db/connection_pool.js';
import config from '../../config.js';

setDefaultTimeout(180_000);

let container;

async function runSql(connection, sqlText) {
  const stmts = sqlText.split(/;\s*$/m).map(s => s.trim()).filter(Boolean);
  for (const s of stmts) {
    await connection.execute(s);
  }
}

BeforeAll({ timeout: 200_000 }, async function () {
  // Levantar contenedor Oracle
  container = await new GenericContainer('gvenzl/oracle-xe')
    .withEnvironment({ ORACLE_PASSWORD: config.oracle.adminPassword })
    .withExposedPorts(config.oracle.port)
    .withWaitStrategy(Wait.forLogMessage('DATABASE IS READY TO USE!'))
    .withStartupTimeout(120_000)
    .start();

  const host = container.getHost();
  const port = container.getMappedPort(config.oracle.port);
  // Actualizo con los datos dinámicos de testcontainers
  config.oracle.connectString = `${host}:${port}/${config.oracle.service}`;
  
  // Conexión de administrador para crear usuario app_user
  const sysConn = await oracledb.getConnection({
    user: config.oracle.admin,
    password: config.oracle.adminPassword,
    connectString: config.oracle.connectString,
  });

  await sysConn.execute(`
    BEGIN
      EXECUTE IMMEDIATE 'DROP USER ' || :username || ' CASCADE';
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
  `, { username: config.oracle.appUser });
  
  await sysConn.execute(`
    CREATE USER ` + config.oracle.appUser + ` IDENTIFIED BY ` + config.oracle.userPassword
  );
  
  await sysConn.execute(`
    GRANT CONNECT, RESOURCE, CREATE SESSION, CREATE TABLE, CREATE SEQUENCE, CREATE TRIGGER TO ` + config.oracle.appUser
  );
  
  await sysConn.execute(`
    ALTER USER ` + config.oracle.appUser + ` QUOTA UNLIMITED ON USERS
  `);
  

  // Inicializar pool y obtener una conexión para cargar el schema
  await oracleDBInstance.init();
  const pool = oracleDBInstance.getPool();
  const connection = await pool.getConnection();

  const ddlPath = path.join(process.cwd(), 'features/support/schema.sql');
  const ddl = await fs.readFile(ddlPath, 'utf8');
  await runSql(connection, ddl);

  // Limpiar tablas antes de los tests
  await connection.execute(`
    BEGIN
      EXECUTE IMMEDIATE 'TRUNCATE TABLE tratamiento_paciente';
      EXECUTE IMMEDIATE 'TRUNCATE TABLE administracion_medicacion';
      EXECUTE IMMEDIATE 'TRUNCATE TABLE ciclo';
      EXECUTE IMMEDIATE 'TRUNCATE TABLE protocolo';
      EXECUTE IMMEDIATE 'TRUNCATE TABLE droga';
      EXECUTE IMMEDIATE 'TRUNCATE TABLE paciente';
      EXECUTE IMMEDIATE 'TRUNCATE TABLE profesional';
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
  `);

  await connection.close(); // devuelve al pool
});
const cleanedFor = new Set();

async function truncateTables(conn) {
  const tables = [
    'ADMINISTRACION_MEDICACION',
    'CICLO',
    'PROTOCOLO',
    'DROGA',
    'PACIENTE',
    'PROFESIONAL'
  ];
  for (const t of tables) {
    try {
      await conn.execute(`TRUNCATE TABLE "${t}"`);
    } catch (e) {
      if (e.errorNum !== 942) console.warn(`[TRUNCATE ${t}] ${e.message}`);
    }
  }
}
/**
 * Resetea TODAS las columnas IDENTITY del esquema a START WITH 1
 * (sin alterar las secuencias ISEQ$$_…)
 */
async function resetIdentityColumns(conn) {
  const res = await conn.execute(
    `SELECT table_name, column_name
       FROM user_tab_identity_cols`,
    [],
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );

  for (const row of res.rows ?? []) {
    const t = row.TABLE_NAME;
    const c = row.COLUMN_NAME;
    // Nota: la sintaxis correcta es ALTER TABLE ... MODIFY ... GENERATED AS IDENTITY (START WITH 1)
    // y sólo funciona si la tabla está vacía (por eso truncamos antes).
    const sql = `ALTER TABLE "${t}" MODIFY ("${c}" GENERATED AS IDENTITY (START WITH 1))`;
    try {
      await conn.execute(sql);
    } catch (e) {
      console.warn(`[IDENTITY RESET ${t}.${c}] ${e.message}`);
    }
  }
  await conn.commit();
}

Before({ timeout: 60_000 }, async function ({ gherkinDocument }) {
  const uri = gherkinDocument?.uri;
  if (!uri || cleanedFor.has(uri)) return;

  const pool = oracleDBInstance.getPool();
  const conn = await pool.getConnection();
  try {
    await truncateTables(conn);
    await resetIdentityColumns(conn);
  } finally {
    await conn.close();
  }
  cleanedFor.add(uri);
});

AfterAll({ timeout: 180_000 }, async function () {
  await oracleDBInstance.close();
  if (container) await container.stop();
});
