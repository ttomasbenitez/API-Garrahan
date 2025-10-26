import express from 'express';
import { authMiddleware, requireRole } from '../middleware/auth.js';

export default function buildProtocoloActualRouter(controller) {
  const r = express.Router();

  r.get('/:paciente_id/protocolo-actual', authMiddleware, requireRole('admin', 'medico'), controller.obtenerDatos);

  return r;
}
