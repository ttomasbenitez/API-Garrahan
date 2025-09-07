import express from 'express';
import { getPool } from '../db/connection_pool.js';
import { crearProtocolo, obtenerProtocolo }  from '../controllers/protocoloController.js';
import { RepositorioProtocolo } from '../persistance/repositorioProtocolo.js';
import logger from '../utils/logger.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const connection = await getPool().getConnection();
  try {
    const { nombre, enfermedad, linea } = req.body;
    if (!nombre || !enfermedad || !linea) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const repositorioProtocolo = new RepositorioProtocolo(connection);
    const protocolo = await crearProtocolo(req.body, repositorioProtocolo);
    logger.info('Protocolo creado con ID: %d', protocolo.protocolo_id);
    res.status(201).json(protocolo);
  } catch (error) {
    logger.error('Error al crear protocolo: %o', error);
    res.status(500).json({ error: error.message });
  } finally {
    await connection.close(); // devuelve la conexión al pool
  }
});

router.get('/:id', async (req, res) => {
  const connection = await getPool().getConnection();
  try {
    const { id } = req.params;
    const repositorioProtocolo = new RepositorioProtocolo(connection);
    const protocolo = await obtenerProtocolo(id, repositorioProtocolo);
    logger.info('Protocolo obtenido con ID: %d', protocolo.protocolo_id);
    res.status(200).json(JSON.stringify(protocolo));
  } catch (error) {
    logger.error('Error al obtener protocolo: %o', error);
    res.status(500).json({ error: error.message });
  } finally {
    await connection.close(); // devuelve la conexión al pool
  }
});

export default router;
