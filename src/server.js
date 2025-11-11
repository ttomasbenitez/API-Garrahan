import app, { alarmaService } from './app.js';
import oracleDB from './db/connection_pool.js';
import logger from './utils/logger.js';
import config from '../config.js';
import { iniciarJobAlarmas } from './jobs/alarmaJob.js';

async function startServer() {
  try {
    await oracleDB.init();
    logger.info('Conexión a Oracle establecida, iniciando servidor...');

    // Iniciar job de alarmas
    iniciarJobAlarmas(alarmaService);

    app.listen(config.app.port, () => logger.info(`Servidor escuchando en puerto ${config.app.port}`));
    const shutdown = async (signal) => {
      try {
        logger.info(`Recibí ${signal}. Cerrando...`);
        await new Promise((r) => app.close(r));
        await oracleDB.close();
        logger.info('Cierre completo. 👋');
        process.exit(0);
      } catch (e) {
        logger.error('Error al cerrar: %o', e);
        process.exit(1);
      }
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

    return app;
  } catch (error) {
    logger.error('No se pudo conectar a Oracle: %o', error);
    process.exit(1);
  }
}

if (config.app.node_env !== 'test') {
  startServer();
}
