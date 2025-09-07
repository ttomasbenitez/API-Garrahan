import app from './app.js';
import { initPool, getPool } from './db/connection_pool.js';
import logger from './utils/logger.js';

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await initPool();
    const pool = await getPool();
    const connection = await pool.getConnection();
    await connection.close();

    logger.info('Conexión a Oracle establecida, iniciando servidor...');
    app.listen(PORT, () => logger.info(`Servidor escuchando en puerto ${PORT}`));
  } catch (error) {
    logger.error('No se pudo conectar a Oracle: %o', error);
    process.exit(1);
  }
}

startServer();
