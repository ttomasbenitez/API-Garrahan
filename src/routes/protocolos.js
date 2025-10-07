import express from 'express';
import { authMiddleware, requireRole } from '../middleware/auth.js';

export default function buildProtocolosRouter(controller) {
  const r = express.Router();
  r.post('/', authMiddleware, requireRole('admin'), controller.crear);
  r.get('/:id', authMiddleware, requireRole('admin', 'medico'), controller.obtener);
  r.post('/:id/ciclo', authMiddleware, requireRole('admin'), controller.agregarCiclo);
  r.post('/:id/ciclo/:id_ciclo/regimen/:id_regimen/administracion',
    authMiddleware, requireRole('admin', 'medico'), controller.agregarAdministracion);
  return r;
}
