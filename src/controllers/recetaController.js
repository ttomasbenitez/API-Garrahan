import e from 'express';
import RecetaPaciente from '../domain/receta/recetaPaciente.js';
import { ERROR_RECETA_PACIENTE_CREACION, ERROR_RECETA_PACIENTE_CREACION_CODE, ERROR_RECETA_PACIENTE_INEXITENTE_CODE, ERROR_RECETA_PACIENTE_NO_ENCONTRADA } from '../errors/receta.js';
import logger from '../utils/logger.js';

export const makeRecetaController = (recetaPacienteService) => ({
  crearRecetaPaciente: (req, res) => crearRecetaPaciente(req, res, recetaPacienteService),
  obtenerRecetaPaciente: (req, res) => obtenerRecetaPaciente(req, res, recetaPacienteService),
});

async function crearRecetaPaciente(req, res, service) {
  try {
    const payload = req.body;
    const recetaPaciente = RecetaPaciente.fromBody(payload);
    await service.crearRecetaPaciente(recetaPaciente);
    logger.info('Receta Paciente creada con IDs: %o', recetaPaciente.id);
    res.status(201).json(recetaPaciente);
  } catch (error) {
    logger.error('Error al crear la receta del paciente: %o', error);
    res.status(error.status || 500).json({ error: error.message || ERROR_RECETA_PACIENTE_CREACION, code: error.code || ERROR_RECETA_PACIENTE_CREACION_CODE });
  }
}

async function obtenerRecetaPaciente(req, res, service) {
  try {
    const { id } = req.params;
    const receta = await service.obtenerRecetaPaciente(id);
    logger.info('Receta del paciente obtenido con ID: %d', receta.id);
    res.status(200).json(receta);
  } catch (error) {
    logger.error('Error al obtener la receta del paciente: %o', error);
    res.status(error.status || 500).json({ error: error.message || ERROR_RECETA_PACIENTE_NO_ENCONTRADA, code: error.code || ERROR_RECETA_PACIENTE_INEXITENTE_CODE });
  }
}
