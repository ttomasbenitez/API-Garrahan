import express from 'express';
import { authMiddleware, requireRole } from '../middleware/auth.js';

export default function buildRecetasRouter(controller) {
  const r = express.Router();
  r.post('/', authMiddleware, requireRole('admin', 'medico'), controller.crearRecetaPaciente);
  r.get('/:id', authMiddleware, requireRole('admin', 'medico'), controller.obtenerRecetaPaciente);
  return r;
}
