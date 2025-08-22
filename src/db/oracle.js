import oracledb from 'oracledb';
import dotenv from 'dotenv';
dotenv.config();

let connection;

async function connectToDatabase() {
  if (!connection) {
    connection = await oracledb.getConnection({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectString: process.env.ORACLE_CONNECT_STRING,
    });
    console.log('Conexión a Oracle establecida');
  }
  return connection;
}

async function closeConnection() {
  if (connection) {
    await connection.close();
    console.log('Conexión a Oracle cerrada');
  }
}

process.on('exit', async () => {
  await closeConnection();
});

export { connectToDatabase, closeConnection };
