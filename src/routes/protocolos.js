import express from 'express';
import { authMiddleware, requireRole } from '../middleware/auth.js';

export default function buildProtocolosRouter(controller) {
  const r = express.Router();
  r.post('/', authMiddleware, requireRole('admin'), controller.crear);
  r.get('/', authMiddleware, requireRole('admin', 'medico'), controller.obtenerTodos);
  r.get('/:id', authMiddleware, requireRole('admin', 'medico'), controller.obtener);
  r.post('/:id/ciclos', authMiddleware, requireRole('admin'), controller.agregarCiclo);
  r.post('/:id/ciclos/:id_ciclo/regimenes/:id_regimen/administraciones',
    authMiddleware, requireRole('admin', 'medico'), controller.agregarAdministracion);
  return r;
}
