import express from 'express';
import { authMiddleware, requireRole } from '../middleware/auth.js';

export default function buildProtocoloPacienteRouter(controller) {
  const r = express.Router();
  r.post('/:paciente_id/protocolos', authMiddleware, requireRole('admin', 'medico'), controller.crear);
  r.get('/:paciente_id/protocolos', authMiddleware, requireRole('admin', 'medico'), controller.obtenerPorPaciente);
  r.get('/:paciente_id/protocolos/:protocolo_id', authMiddleware, requireRole('admin', 'medico'), controller.obtenerEspecifico);
  r.patch('/:paciente_id/protocolos/:protocolo_paciente_id', authMiddleware, requireRole('admin', 'medico'), controller.patch);
  return r;
}
