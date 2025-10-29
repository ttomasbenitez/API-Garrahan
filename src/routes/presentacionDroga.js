import express from 'express';
import { authMiddleware, requireRole } from '../middleware/auth.js';

export default function buildPresentacionDrogaRouter(controller) {
  const r = express.Router();
  r.post('/:droga_id/presentaciones', authMiddleware, requireRole('admin'), controller.crear);
  r.get('/:droga_id/presentaciones/:presentacion_id', authMiddleware, requireRole('admin', 'medico'), controller.obtener);
  r.get('/:droga_id/presentaciones', authMiddleware, requireRole('admin', 'medico'), controller.listar);
  r.delete('/:droga_id/presentaciones/:presentacion_id', authMiddleware, requireRole('admin'), controller.eliminar);
  return r;
}
