import express from 'express';

export default function buildDrogasRouter(controller) {
  const r = express.Router();
  r.post('/', controller.crear);
  return r;
}
