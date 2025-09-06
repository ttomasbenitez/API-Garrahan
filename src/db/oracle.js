import oracledb from 'oracledb';
import dotenv from 'dotenv';
dotenv.config();

class OracleConnection {
  constructor() {
    this.connection = null;
  }

  async connect() {
    if (!this.connection) {
      this.connection = await oracledb.getConnection({
        user: process.env.ORACLE_USER,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_CONNECT_STRING,
      });
      console.log('Conexión a Oracle establecida');
    }
  }

  async close() {
    if (this.connection) {
      await this.connection.close();
      console.log('Conexión a Oracle cerrada');

    }
  }

  async execute(query, params = {}, options = {}) {
    if (!this.connection) {
      throw new Error('No hay conexión a la base de datos');
    }
    return this.connection.execute(query, params, options);
  }

}

export default OracleConnection;
