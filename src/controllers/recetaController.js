import RecetaPaciente from '../domain/receta/recetaPaciente.js';
import { ERROR_RECETA_PACIENTE_CREACION, ERROR_RECETA_PACIENTE_CREACION_CODE, ERROR_RECETA_PACIENTE_INEXITENTE_CODE, ERROR_RECETA_PACIENTE_NO_ENCONTRADA } from '../errors/receta.js';
import { RECETA_TIPO_HOSPITALARIA } from '../utils/constants.js';
import logger from '../utils/logger.js';

export const makeRecetaController = (recetaPacienteService) => ({
  crear: (req, res) => crearRecetaPaciente(req, res, recetaPacienteService),
  obtener: (req, res) => obtenerRecetaPaciente(req, res, recetaPacienteService),
  obtenerTodas: (req, res) => obtenerRecetasPaciente(req, res, recetaPacienteService),
  exportar: (req, res) => exportarRecetaPaciente(req, res, recetaPacienteService),
});

async function crearRecetaPaciente(req, res, service) {
  try {
    const payload = req.body;
    const recetaPaciente = RecetaPaciente.fromBody(payload);
    const id = await service.crear(recetaPaciente);
    logger.info('Receta Paciente creada con IDs: %o', recetaPaciente.id);

    res.status(201).json({id});
  } catch (error) {
    logger.error('Error al crear la receta del paciente: %o', error);
    res.status(error.status || 500).json({ error: error.message || ERROR_RECETA_PACIENTE_CREACION, code: error.code || ERROR_RECETA_PACIENTE_CREACION_CODE });
  }
}

async function obtenerRecetaPaciente(req, res, service) {
  try {
    const { id } = req.params;
    const receta = await service.obtener(id);
    logger.info('Receta del paciente obtenido con ID: %d', receta.id);
    res.status(200).json(receta);
  } catch (error) {
    logger.error('Error al obtener la receta del paciente: %o', error);
    res.status(error.status || 500).json({ error: error.message || ERROR_RECETA_PACIENTE_NO_ENCONTRADA, code: error.code || ERROR_RECETA_PACIENTE_INEXITENTE_CODE });
  }
}

async function exportarRecetaPaciente(req, res, service) {
  try {
    const { id } = req.params;
    const tipo = req.query.tipo || RECETA_TIPO_HOSPITALARIA;
    logger.info('Exportando receta del paciente con ID: %d y tipo: %s', id, tipo);
    const recetaExportada = await service.exportar(id, tipo);
    logger.info('Receta del paciente exportada con ID: %d', id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=receta_${req.params.id}.pdf`);
    res.send(recetaExportada);
    res.status(200);
    logger.info('Receta del paciente exportada con ID: %d', id);
  } catch (error) {
    logger.error('Error al exportar la receta del paciente: %o', error);
    res.status(error.status || 500).json({ error: error.message || 'Error al exportar la receta del paciente', code: error.code || 'RECETA_PACIENTE_EXPORTACION_ERROR' });
  }
}

async function obtenerRecetasPaciente(req, res, service) {
  try {
    const paciente_id = req.query.paciente_id;
    const recetas = await service.obtenerTodas(paciente_id);
    logger.info('Recetas obtenidas para el paciente con ID: %d', paciente_id);
    res.status(200).json(recetas);
  } catch (error) {
    logger.error('Error al obtener la receta del paciente: %o', error);
    res.status(error.status || 500).json({ error: error.message || ERROR_RECETA_PACIENTE_NO_ENCONTRADA, code: error.code || ERROR_RECETA_PACIENTE_INEXITENTE_CODE });
  }
}
