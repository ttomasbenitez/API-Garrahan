import express from 'express';

export default function buildProtocolosRouter(controller) {
  const r = express.Router();
  r.post('/', controller.crear);
  r.get('/:id', controller.obtener);
  r.post('/:id/ciclo', controller.agregarCiclo);
  return r;
}
