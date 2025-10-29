import express from 'express';

export default function calculoDrogaRoutes(controller) {
  const router = express.Router();
  router.post('/calculo-droga', controller.calcular);
  return router;
}
