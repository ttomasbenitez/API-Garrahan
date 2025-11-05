import Paciente from '../domain/paciente.js';
import logger from '../utils/logger.js';
import { ERROR_PACIENTE_NO_ASOCIADO } from '../errors/pacienteProfesional.js';

export const makePacienteController = (pacienteService) => ({
  crear: (req, res) => crearPaciente(req, res, pacienteService),
  obtener: (req, res) => obtenerPaciente(req, res, pacienteService),
  obtenerTodos: (req, res) => obtenerPacientes(req, res, pacienteService),
  obtenerEquipoTratante: (req, res) => obtenerEquipoTratante(req, res, pacienteService),
  obtenerExterno: (req, res) => obtenerPacienteExterno(req, res, pacienteService),
  actualizarParcialmente: (req, res) => actualizarParcialmente(req, res, pacienteService),
});

async function crearPaciente(req, res, service) {
  try {
    const profesional_id = req.user.id;
    const { nombre, apellido, id_hospitalario, fecha_nacimiento, peso, altura, sexo, obra_social, dni} = req.body;
    if (!id_hospitalario || !profesional_id) {
      logger.error('Error al crear paciente: Faltan campos requeridos' );
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const fecha_nacimiento_date = fecha_nacimiento ? new Date(fecha_nacimiento) : null;

    const paciente = new Paciente(nombre, apellido, id_hospitalario, fecha_nacimiento_date, peso, altura, sexo, obra_social, dni);
    await service.crear(paciente, profesional_id);
    logger.info('Paciente creado con ID: %d', paciente.paciente_id);
    res.status(201).json(paciente);
  } catch (error) {
    logger.error('Error al crear paciente: %o', error);
    res.status(500).json({ error: error.message });
  }
}

async function obtenerPaciente(req, res, service) {
  try {
    const profesional_id = req.user.id;
    const { id } = req.params;
    logger.info('aca');
    const paciente = await service.obtenerPorProfesional(id, profesional_id);
    logger.info(paciente);
    logger.info('Paciente obtenido con ID: %d', paciente.paciente_id);
    res.status(200).json(paciente);
  } catch (error) {
    logger.error('Error al obtener paciente: %o', error);
    if (error.message === ERROR_PACIENTE_NO_ASOCIADO ) {
      res.status(404).json({ error: error.message });
    }
    else {
      res.status(500).json({ error: error.message });
    }
  }
}

async function obtenerPacientes(req, res, service) {
  try {
    const pacientes = await service.obtenerTodos();
    logger.info('Pacientes obtenidos');
    res.status(200).json(pacientes);
  } catch (error) {
    logger.error('Error al obtener los pacientes: %o', error);
    res.status(500).json({ error: error.message });
  }
}

async function obtenerPacienteExterno(req, res, service) {
  try {
    const { id } = req.params;
    const paciente = await service.obtenerExterno(id);
    logger.info('Paciente obtenido con ID: %d', paciente.id_hospitalario);
    res.status(200).json(paciente);
  } catch (error) {
    logger.error('Error al obtener paciente: %o', error);
    if (error.message === ERROR_PACIENTE_NO_ASOCIADO ) {
      res.status(404).json({ error: error.message });
    }
    else {
      res.status(500).json({ error: error.message });
    }
  }
}

async function actualizarParcialmente(req, res, service) {
  try {
    const { id } = req.params;

    await service.actualizarParcialmente(id, req.body);
    logger.info('Paciente actualizado con ID: %d', id);
    res.status(200).json(id);
  } catch (error) {
    logger.error('Error al actualizar paciente: %o', error);
    res.status(500).json({ error: error.message });
  }
}

async function obtenerEquipoTratante(req, res, service) {
  try {
    const { id } = req.params;
    const equipo = await service.obtenerEquipoTratante(id);
    logger.info('Equipo tratante obtenido para paciente ID: %d', id);
    res.status(200).json(equipo);
  } catch (error) {
    logger.error('Error al obtener equipo tratante: %o', error);
    res.status(500).json({ error: error.message });
  }
}
