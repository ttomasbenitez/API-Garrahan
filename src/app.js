import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { connectToDatabase } from './db/oracle.js';
import logger from './utils/logger.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/', routes);

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectToDatabase();
    logger.info('Conexión a Oracle establecida, iniciando servidor...');
    app.listen(PORT, () => logger.info(`Servidor escuchando en puerto ${PORT}`));
  } catch (error) {
    logger.error('No se pudo conectar a Oracle: %o', error);
    process.exit(1);
  }
}

startServer();
