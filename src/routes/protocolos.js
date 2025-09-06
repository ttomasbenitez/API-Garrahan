import express from 'express';
import { crearProtocolo, obtenerProtocolo }  from '../controllers/protocoloController.js';
import { RepositorioProtocolo } from '../persistance/repositorioProtocolo.js';
import OracleConnection from '../db/oracle.js';
import logger from '../utils/logger.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { nombre, enfermedad, linea } = req.body;
    if (!nombre || !enfermedad || !linea) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    const oracleConnection = new OracleConnection();
    await oracleConnection.connect();
    const repositorioProtocolo = new RepositorioProtocolo(oracleConnection.connection);
    const protocolo = await crearProtocolo(req.body, repositorioProtocolo);
    logger.info('Protocolo creado con ID: %d', protocolo.protocolo_id);
    res.status(201).json(protocolo);
    await oracleConnection.close();
  } catch (error) {
    logger.error('Error al crear protocolo: %o', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    const oracleConnection = new OracleConnection();
    await oracleConnection.connect();
    const repositorioProtocolo = new RepositorioProtocolo(oracleConnection.connection);
    const protocolo = await obtenerProtocolo(id, repositorioProtocolo);
    logger.info('Protocolo obtenido con ID: %d', protocolo.protocolo_id);
    res.json(protocolo);
    await oracleConnection.close();
  } catch (error) {
    logger.error('Error al obtener protocolo: %o', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
