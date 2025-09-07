import oracledb from 'oracledb';
import dotenv from 'dotenv';
dotenv.config();

let pool;

export async function initPool() {
  pool = await oracledb.createPool({
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: process.env.ORACLE_CONNECT_STRING,
    poolMin: 2,
    poolMax: 10,
    poolIncrement: 1
  });
}

export function getPool() {
  if (!pool) throw new Error('Pool no inicializado');
  return pool;
}
