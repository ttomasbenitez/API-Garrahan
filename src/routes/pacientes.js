import express from 'express';

export default function buildPacientesRouter(controller) {
  const r = express.Router();
  r.post('/', controller.crear);
  r.get('/:id', controller.obtener);
  r.get('/:id/equipo-tratante', controller.obtenerEquipoTratante);
  return r;
}
