import express from 'express';
import { crearProtocolo, obtenerProtocolo }  from '../controllers/protocoloController.js';
import { RepositorioProtocolo } from '../persistance/repositorioProtocolo.js';
import { connectToDatabase } from '../db/oracle.js';

const router = express.Router();

router.post('/protocolo', async (req, res) => {
  try {
    const { nombre, enfermedad, linea } = req.body;
    if (!nombre || !enfermedad || !linea) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    const conn = await connectToDatabase();
    const repositorioProtocolo = new RepositorioProtocolo(conn);
    const protocolo = await crearProtocolo(req.body, repositorioProtocolo);
    res.status(201).json(protocolo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/protocolo/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    const conn = await connectToDatabase();
    const repositorioProtocolo = new RepositorioProtocolo(conn);
    const protocolo = await obtenerProtocolo(id, repositorioProtocolo);
    res.json(protocolo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
