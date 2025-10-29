import Profesional from '../domain/profesional.js';
import logger from '../utils/logger.js';

export const makeProfesionalController = (profesionalService) => ({
  crear: (req, res) => crearProfesional(req, res, profesionalService),
  obtener: (req, res) => obtenerProfesional(req, res, profesionalService),
});

async function crearProfesional(req, res, service) {
  try {
    const { nombre, apellido, dni, matricula, especialidad} = req.body;
    if (!nombre || !apellido || !dni) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const profesional = new Profesional(nombre, apellido, dni, matricula, especialidad);
    await service.crear(profesional);
    logger.info('Profesional creado con ID: %d', profesional.profesional_id);
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
    logger.info('Profesional obtenido con ID: %d', profesional.profesional_id);
    res.status(200).json(profesional);
  } catch (error) {
    logger.error('Error al obtener profesional: %o', error);
    res.status(500).json({ error: error.message });
  }
}
