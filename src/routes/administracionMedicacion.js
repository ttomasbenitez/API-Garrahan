import express from 'express';

export default function administracionMedicacionRoutes(controller) {
  const router = express.Router();
  router.get('/:admin_id', controller.getById);
  return router;
}
