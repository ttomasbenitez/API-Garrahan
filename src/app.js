require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { connectToDatabase } = require('./db/oracle');
const logger = require('./utils/logger');

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
