import express from 'express';
import { authMiddleware, requireRole } from '../middleware/auth.js';

export default function buildPresentacionDrogaRouter(controller) {
  const r = express.Router();
  r.post('/', authMiddleware, requireRole('admin'), controller.crear);
  r.get('/:id', authMiddleware, requireRole('admin', 'medico'), controller.obtener);
  r.get('/', authMiddleware, requireRole('admin', 'medico'), controller.listar);
  r.delete('/:id', authMiddleware, requireRole('admin'), controller.eliminar);
  return r;
}
