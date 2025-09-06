import app from './app.js';
import OracleConnection from './db/oracle.js';
import logger from './utils/logger.js';

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    const oracleConnection = new OracleConnection();
    await oracleConnection.connect();
    logger.info('Conexión a Oracle establecida, iniciando servidor...');
    app.listen(PORT, () => logger.info(`Servidor escuchando en puerto ${PORT}`));
  } catch (error) {
    logger.error('No se pudo conectar a Oracle: %o', error);
    process.exit(1);
  }
}

startServer();
