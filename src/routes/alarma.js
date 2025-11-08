import express from 'express';
import { authMiddleware, requireRole } from '../middleware/auth.js';

export default function alarmaRoutes(controller) {
  const r = express.Router();

  r.get('/', authMiddleware, controller.listar);
  r.post('/generar', authMiddleware, requireRole('admin'), controller.generarManual);

  return r;
}
