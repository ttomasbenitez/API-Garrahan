import Profesional from '../domain/profesional.js';
import logger from '../utils/logger.js';

export const makeProfesionalController = (profesionalService) => ({
  crear: (req, res) => crearProfesional(req, res, profesionalService),
  obtener: (req, res) => obtenerProfesional(req, res, profesionalService),
  obtenerTodos: (req, res) => obtenerTodos(req, res, profesionalService),
  obtenerExterno: (req, res) => obtenerExterno(req, res, profesionalService),

});

async function crearProfesional(req, res, service) {
  try {
    const { nombre, apellido, dni, matricula, especialidad} = req.body;
    if (!nombre || !apellido || !dni) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const profesional = new Profesional(nombre, apellido, dni, matricula, especialidad);
    await service.crear(profesional);
    logger.info('Profesional creado con DNI: %d', profesional.dni);
    res.status(201).json(profesional);
  } catch (error) {
    logger.error('Error al crear profesional: %o', error);
    res.status(500).json({ error: error.message });
  }
}

async function obtenerProfesional(req, res, service) {
  try {
    const { id } = req.params;
    const profesional = await service.obtener(id);
    logger.info('Profesional obtenido con DNI: %d', profesional.dni);
    res.status(200).json(profesional);
  } catch (error) {
    logger.error('Error al obtener profesional: %o', error);
    res.status(500).json({ error: error.message });
  }
}

async function obtenerExterno(req, res, service) {
  try {
    const { dni } = req.params;
    const profesional = await service.obtenerExterno(dni);
    logger.info('Profesional externo obtenido con DNI: %d', profesional.dni);
    res.status(200).json(profesional);
  } catch (error) {
    logger.error('Error al obtener profesional externo: %o', error.message);
    res.status(500).json({ error: error.message });
  }
}

async function obtenerTodos(req, res, service) {
  try {
    const profesionales = await service.obtenerTodos();
    logger.info('Profesionales obtenidos: %d', profesionales.length);
    res.status(200).json(profesionales);
  } catch (error) {
    logger.error('Error al obtener profesionales: %o', error);
    res.status(500).json({ error: error.message });
  }
}
