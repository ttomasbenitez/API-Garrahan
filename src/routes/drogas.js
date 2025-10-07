import express from 'express';
import { authMiddleware, requireRole } from '../middleware/auth.js';

export default function buildDrogasRouter(controller) {
  const r = express.Router();
  r.post('/', authMiddleware, requireRole('admin'), controller.crear);
  r.get('/:id', authMiddleware, requireRole('admin', 'medico'), controller.obtener);
  return r;
}
