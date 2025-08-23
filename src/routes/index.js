import express from 'express';
import protocolosRoutes from './protocolos.js';

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

router.use('/protocolo', protocolosRoutes);

export default router;
