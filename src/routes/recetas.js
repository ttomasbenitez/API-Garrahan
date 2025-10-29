import express from 'express';
import { authMiddleware, requireRole } from '../middleware/auth.js';

export default function buildRecetasRouter(controller) {
  const r = express.Router();
  r.post('/', authMiddleware, requireRole('admin', 'medico'), controller.crear);
  r.get('/:id', authMiddleware, requireRole('admin', 'medico'), controller.obtener);
  r.get('/:id/exportar', authMiddleware, requireRole('admin', 'medico'), controller.exportar);
  return r;
}
