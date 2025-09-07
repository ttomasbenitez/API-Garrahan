import oracledb from 'oracledb';
import dotenv from 'dotenv';
dotenv.config();

class oracleBD {
  pool = null;

  async init() {
    this.pool = await oracledb.createPool({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectString: process.env.ORACLE_CONNECT_STRING,
      poolMin: 2,
      poolMax: 10,
      poolIncrement: 1
    });
  }

  getPool() {
    if (!this.pool) throw new Error('Pool no inicializado');
    return this.pool;
  }

  async withConnection(fn) {
    const pool = this.getPool();
    const conn = await pool.getConnection();
    try { return await fn(conn); } finally { await conn.close(); }
  }

  async execute(...args) {
    return await this.withConnection((conn) => conn.execute(...args));
  }

  async close() {
    if (this.pool) {
      await this.pool.close(10);
      this.pool = null;
    }
  }
}

const oracleDBInstance = new oracleBD();
export default oracleDBInstance;
