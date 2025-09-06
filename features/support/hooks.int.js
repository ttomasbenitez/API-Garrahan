import { BeforeAll, AfterAll } from '@cucumber/cucumber';
import { GenericContainer, Wait } from 'testcontainers';
import oracledb from 'oracledb';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { connectToDatabase, closeConnection } from '../../src/db/oracle.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let container;

async function runSql(conn, sqlText) {
  // Ejecuta statements separados por ';' (ignora líneas vacías)
  const stmts = sqlText.split(/;\s*$/m).map(s => s.trim()).filter(Boolean);
  for (const s of stmts) {
    await conn.execute(s);
  }
}

BeforeAll({ timeout: 180_000 }, async function () {
  // 1) Arrancar Oracle XE en Docker
  container = await new GenericContainer('gvenzl/oracle-xe')
    .withEnv('ORACLE_PASSWORD', 'oracle')
    .withExposedPorts(1521)
    .withWaitStrategy(Wait.forLogMessage('DATABASE IS READY TO USE!'))
    .start();

  const host = 'localhost';
  const port = container.getMappedPort(1521);
  const service = 'XEPDB1';
  const sysConnect = `${host}:${port}/${service}`;

  // 2) Crear usuario de app y schema usando SYSTEM
  const sysConn = await oracledb.getConnection({
    user: 'system',
    password: 'oracle',
    connectString: sysConnect,
  });

  // (re)crear usuario app_user
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

  // 3) Setear ENV VARS que usa tu connectToDatabase()
  process.env.ORACLE_USER = 'app_user';
  process.env.ORACLE_PASSWORD = 'app_pass';
  process.env.ORACLE_CONNECT_STRING = `${host}:${port}/${service}`;

  // 4) Conectar con tu función, y crear el schema de pruebas
  const appConn = await connectToDatabase();

  const ddlPath = path.join(__dirname, 'schema.sql'); // tu DDL
  const ddl = await fs.readFile(ddlPath, 'utf8');
  await runSql(appConn, ddl);

  // 5) (Opcional) limpiar tablas antes de empezar
  await appConn.execute(`
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
});

AfterAll(async function () {
  // Cerrá conexión y bajá el contenedor
  await closeConnection();
  await container?.stop();
});
