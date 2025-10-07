import express from 'express';

export default function buildViaAdministracionRouter(controller) {
  const r = express.Router();
  r.post('/', controller.crear);
  return r;
}
