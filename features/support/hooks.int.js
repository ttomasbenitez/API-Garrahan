import { BeforeAll, AfterAll } from '@cucumber/cucumber';
import { GenericContainer, Wait } from 'testcontainers';
import oracledb from 'oracledb';
import fs from 'node:fs/promises';
import path from 'node:path';
import { initPool, getPool } from '../../src/db/connection_pool.js';

let container;

async function runSql(connection, sqlText) {
  const stmts = sqlText.split(/;\s*$/m).map(s => s.trim()).filter(Boolean);
  for (const s of stmts) {
    await connection.execute(s);
  }
}

BeforeAll({ timeout: 180_000 }, async function () {
  // Levantar contenedor Oracle
  container = await new GenericContainer('gvenzl/oracle-xe')
    .withEnvironment({ ORACLE_PASSWORD: 'oracle' })
    .withExposedPorts(1521)
    .withWaitStrategy(Wait.forLogMessage('DATABASE IS READY TO USE!'))
    .withStartupTimeout(120_000)
    .start();

  const host = container.getHost();
  const port = container.getMappedPort(1521);
  const service = 'XEPDB1';
  const sysConnect = `${host}:${port}/${service}`;

  // Conexión de administrador para crear usuario app_user
  const sysConn = await oracledb.getConnection({
    user: 'system',
    password: 'oracle',
    connectString: sysConnect,
  });

  await sysConn.execute(`
    BEGIN
      EXECUTE IMMEDIATE 'DROP USER app_user CASCADE';
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
  `);
  await sysConn.execute('CREATE USER app_user IDENTIFIED BY app_pass');
  await sysConn.execute(`
    GRANT CONNECT, RESOURCE, CREATE SESSION, CREATE TABLE, CREATE SEQUENCE, CREATE TRIGGER TO app_user
  `);
  await sysConn.execute('ALTER USER app_user QUOTA UNLIMITED ON USERS');
  await sysConn.close();

  // Configurar variables de entorno para el pool
  process.env.ORACLE_USER = 'app_user';
  process.env.ORACLE_PASSWORD = 'app_pass';
  process.env.ORACLE_CONNECT_STRING = `${host}:${port}/${service}`;

  // Inicializar pool y obtener una conexión para cargar el schema
  await initPool();
  const pool = await getPool();
  const connection = await pool.getConnection();

  const ddlPath = path.join(process.cwd(), 'features/support/schema.sql');
  const ddl = await fs.readFile(ddlPath, 'utf8');
  await runSql(connection, ddl);

  // Limpiar tablas antes de los tests
  await connection.execute(`
    BEGIN
      EXECUTE IMMEDIATE 'TRUNCATE TABLE tratamiento_paciente';
      EXECUTE IMMEDIATE 'TRUNCATE TABLE administracion_medicacion';
      EXECUTE IMMEDIATE 'TRUNCATE TABLE ciclos_finales';
      EXECUTE IMMEDIATE 'TRUNCATE TABLE ciclo';
      EXECUTE IMMEDIATE 'TRUNCATE TABLE protocolo';
      EXECUTE IMMEDIATE 'TRUNCATE TABLE drogas';
      EXECUTE IMMEDIATE 'TRUNCATE TABLE paciente';
      EXECUTE IMMEDIATE 'TRUNCATE TABLE profesional';
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
  `);

  await connection.close(); // devuelve al pool
});

AfterAll(async function () {
  // Cerrar pool y contenedor
  const pool = await getPool();
  await pool.close();
  if (container) await container.stop();
});
