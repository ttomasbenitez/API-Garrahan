import express from 'express';

export default function buildProfesionalesRouter(controller) {
  const r = express.Router();
  r.post('/', controller.crear);
  r.get('/:id', controller.obtener);
  return r;
}
