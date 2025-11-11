import express from 'express';
import { authMiddleware, requireRole } from '../middleware/auth.js';

export default function buildConfiguracionAlarmaRouter(controller) {
  const r = express.Router();

  r.get('/', authMiddleware, requireRole('admin', 'medico'), controller.obtener);
  r.put('/limite', authMiddleware, requireRole('admin'), controller.actualizarLimite);

  return r;
}
