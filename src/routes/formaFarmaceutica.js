import express from 'express';
import { authMiddleware, requireRole } from '../middleware/auth.js';

export default function buildFormaFarmaceuticaRouter(controller) {
  const r = express.Router();
  r.post('/', authMiddleware, requireRole('admin'), controller.crear);
  r.get('/:id', authMiddleware, requireRole('admin', 'medico'), controller.obtener);
  r.get('/', authMiddleware, requireRole('admin', 'medico'), controller.listar);
  r.put('/:id', authMiddleware, requireRole('admin'), controller.actualizar);
  return r;
}
