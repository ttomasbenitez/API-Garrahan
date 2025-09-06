import { BeforeAll, AfterAll } from '@cucumber/cucumber';
import { GenericContainer, Wait } from 'testcontainers';
import oracledb from 'oracledb';
import fs from 'node:fs/promises';
import path from 'node:path';
import { connectToDatabase, closeConnection } from '../../src/db/oracle.js';

let container;

async function runSql(conn, sqlText) {
  const stmts = sqlText.split(/;\s*$/m).map(s => s.trim()).filter(Boolean);
  for (const s of stmts) {
    await conn.execute(s);
  }
}

BeforeAll({ timeout: 180_000 }, async function () {
  container = await new GenericContainer('gvenzl/oracle-xe')
  .withEnvironment({ ORACLE_PASSWORD: 'oracle' })
  .withExposedPorts(1521)
  .withWaitStrategy(Wait.forLogMessage('DATABASE IS READY TO USE!'))
  .withStartupTimeout(120_000)
  .start();

  const host = 'localhost';
  const port = container.getMappedPort(1521);
  const service = 'XEPDB1';
  const sysConnect = `${host}:${port}/${service}`;

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

  process.env.ORACLE_USER = 'app_user';
  process.env.ORACLE_PASSWORD = 'app_pass';
  process.env.ORACLE_CONNECT_STRING = `${host}:${port}/${service}`;

  const appConn = await connectToDatabase();

  const ddlPath = path.join(process.cwd(), 'features/support/schema.sql');
  const ddl = await fs.readFile(ddlPath, 'utf8');
  await runSql(appConn, ddl);

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
  await closeConnection();
  if (container) await container.stop();
});