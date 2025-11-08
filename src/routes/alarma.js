import express from 'express';
import { authMiddleware } from '../middleware/auth.js';

export default function buildAlarmaRouter(controller) {
  const r = express.Router();

  r.get('/', authMiddleware, controller.listar);

  return r;
}
