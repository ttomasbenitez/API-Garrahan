import express from 'express';
import { authMiddleware, requireRole } from '../middleware/auth.js';

export default function buildPresentacionDrogaViaRouter(controller) {
  const r = express.Router();

  r.post('/', authMiddleware, requireRole('admin'), controller.crear);
  r.get('/presentacion/:presentacion_id', authMiddleware, requireRole('admin', 'medico'), controller.listarPorPresentacion);
  r.get('/:via_id/:presentacion_id', authMiddleware, requireRole('admin', 'medico'), controller.obtener);
  r.delete('/:via_id/:presentacion_id', authMiddleware, requireRole('admin'), controller.eliminar);

  return r;
}
