import e from 'express';
import RecetaPaciente from '../domain/receta/recetaPaciente.js';
import { ERROR_RECETA_PACIENTE_CREACION, ERROR_RECETA_PACIENTE_CREACION_CODE } from '../errors/receta.js';
import logger from '../utils/logger.js';

export const makeRecetaController = (recetaPacienteService) => ({
  crearRecetaPaciente: (req, res) => crearRecetaPaciente(req, res, recetaPacienteService),
});

async function crearRecetaPaciente(req, res, service) {
  try {
    const payload = req.body;

    const recetaPaciente = new RecetaPaciente(
      payload.protocolo_id,
      payload.ciclo_id,
      payload.regimen,
      payload.paciente_id,
      payload.profesional_id,
      payload.estado,
      payload.peso,
      payload.talla,
      payload.superficie_corporal,
      payload.fecha_receta,
    );

    await service.crearRecetaPaciente(recetaPaciente);
    logger.info('Receta Paciente creada con IDs: %o', recetaPaciente.id);
    res.status(201).json(recetaPaciente);
  } catch (error) {
    logger.error('Error al crear la receta del paciente: %o', error);
    res.status(error.status || 500).json({ error: error.message || ERROR_RECETA_PACIENTE_CREACION, code: error.code || ERROR_RECETA_PACIENTE_CREACION_CODE });
  }
}
