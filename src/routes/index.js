import express from 'express';
import { crearProtocolo, obtenerProtocolo }  from '../controllers/protocoloController.js';

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

router.post('/protocolo', crearProtocolo);
router.get('/protocolo/:id', obtenerProtocolo);

export default router;

