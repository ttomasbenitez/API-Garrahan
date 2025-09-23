import Paciente from '../domain/paciente.js';
import logger from '../utils/logger.js';

export const makePacienteController = (pacienteService) => ({
  crear: (req, res) => crearPaciente(req, res, pacienteService),
  obtener: (req, res) => obtenerPaciente(req, res, pacienteService),
});

async function crearPaciente(req, res, service) {
  try {
    const { nombre, apellido, id_hospitalario, fecha_nacimiento, peso,
      sexo, profesional_id, obra_social} = req.body;
    if (!id_hospitalario || !profesional_id) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const fecha_nacimiento_date = fecha_nacimiento ? new Date(fecha_nacimiento) : null;

    const paciente = new Paciente(nombre, apellido, id_hospitalario, fecha_nacimiento_date, peso, sexo, profesional_id, obra_social);
    await service.crear(paciente);
    logger.info('Paciente creado con ID: %d', paciente.id);
    res.status(201).json(paciente);
  } catch (error) {
    logger.error('Error al crear paciente: %o', error);
    res.status(500).json({ error: error.message });
  }
}

async function obtenerPaciente(req, res, service) {
  try {
    const { id } = req.params;
    const paciente = await service.obtener(id);
    logger.info('Paciente obtenido con ID: %d', paciente.id);
    res.status(200).json(JSON.stringify(paciente));
  } catch (error) {
    logger.error('Error al obtener paciente: %o', error);
    res.status(500).json({ error: error.message });
  }
}
