import oracledb from 'oracledb';
import config from '../../config.js';

// Configuración global
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

class oracleBD {
  pool = null;

  async init() {
    this.pool = await oracledb.createPool({
      user: config.oracle.appUser,
      password: config.oracle.userPassword,
      connectString: config.oracle.connectString,
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

    try {
      // 🔥 Seteamos la zona horaria local de Argentina en la sesión
      await conn.execute('ALTER SESSION SET TIME_ZONE = \'America/Argentina/Buenos_Aires\'');

      // Ejecutamos la función del usuario con esta sesión ya configurada
      return await fn(conn);
    } finally {
      await conn.close();
    }
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
