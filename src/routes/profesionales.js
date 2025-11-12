import express from 'express';
import { authMiddleware, requireRole } from '../middleware/auth.js';

export default function buildProfesionalesRouter(controller) {
  const r = express.Router();
  r.post('/', authMiddleware, requireRole('admin'), controller.crear);
  r.get('/:id', authMiddleware, requireRole('admin'), controller.obtener);
  r.get('/', authMiddleware, requireRole('admin'), controller.obtenerTodos);
  r.get('/externo/:dni', authMiddleware, requireRole('admin', 'medico'), controller.obtenerExterno);
  return r;
}
