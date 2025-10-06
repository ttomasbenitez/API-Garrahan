import logger from '../utils/logger.js';
import { 
  ERROR_PROFESIONAL_NO_ENCONTRADO, 
  ERROR_PROFESIONAL_YA_ASIGNADO,
  ERROR_PACIENTE_NO_ENCONTRADO,
  ERROR_ID_PACIENTE_REQUERIDO,
  ERROR_ID_PROFESIONAL_REQUERIDO,
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_ERROR,
  ERROR_CODES
} from '../errors/pacienteProfesional.js';

export const makePacienteProfesionalController = (pacienteProfesionalService) => ({
  agregarColaborador: (req, res) => agregarProfesionalColaborador(req, res, pacienteProfesionalService),
  cambiarPrincipal: (req, res) => cambiarProfesionalPrincipal(req, res, pacienteProfesionalService),
  obtenerEquipo: (req, res) => obtenerEquipoTratante(req, res, pacienteProfesionalService),
  obtenerPacientes: (req, res) => obtenerPacientesDelProfesional(req, res, pacienteProfesionalService),
  removerColaborador: (req, res) => removerProfesionalColaborador(req, res, pacienteProfesionalService),
});

async function agregarProfesionalColaborador(req, res, service) {
  try {
    const { profesional_id, paciente_id, rol } = req.body;
    
    if (!profesional_id || !paciente_id) {
      return res.status(400).json({ error: 'profesional_id y paciente_id son requeridos' });
    }

    await service.agregarProfesionalColaborador(profesional_id, paciente_id, rol);
    logger.info('Profesional %d agregado como colaborador al paciente %d', profesional_id, paciente_id);
    res.status(201).json({ message: 'Profesional colaborador agregado correctamente' });
  } catch (error) {
    logger.error('Error al agregar profesional colaborador: %o', error);
    
    if (error.message === ERROR_PROFESIONAL_YA_ASIGNADO) {
      return res.status(STATUS_BAD_REQUEST).json({ error: error.message });
    }
    if (error.message === ERROR_PROFESIONAL_NO_ENCONTRADO) {
      return res.status(STATUS_INTERNAL_ERROR).json({ error: error.message });
    }
    if (error.message === ERROR_PACIENTE_NO_ENCONTRADO) {
      return res.status(STATUS_NOT_FOUND).json({ error: error.message });
    }
    
    res.status(error.status || STATUS_INTERNAL_ERROR).json({ error: error.message });
  }
}

async function cambiarProfesionalPrincipal(req, res, service) {
  try {
    const { paciente_id } = req.params;
    const { nuevo_profesional_id } = req.body;
    
    if (!nuevo_profesional_id) {
      return res.status(400).json({ error: 'nuevo_profesional_id es requerido' });
    }

    await service.cambiarProfesionalPrincipal(paciente_id, nuevo_profesional_id);
    logger.info('Profesional principal del paciente %d cambiado a %d', paciente_id, nuevo_profesional_id);
    res.status(200).json({ message: 'Profesional principal cambiado correctamente' });
  } catch (error) {
    logger.error('Error al cambiar profesional principal: %o', error);
    res.status(error.status || 500).json({ error: error.message });
  }
}

async function obtenerEquipoTratante(req, res, service) {
  try {
    const { paciente_id } = req.params;
    const equipo = await service.obtenerEquipoTratante(paciente_id);
    logger.info('Equipo tratante obtenido para paciente %d: %d profesionales', paciente_id, equipo.length);
    res.status(200).json(equipo);
  } catch (error) {
    logger.error('Error al obtener equipo tratante: %o', error);
    res.status(error.status || 500).json({ error: error.message });
  }
}

async function obtenerPacientesDelProfesional(req, res, service) {
  try {
    const { profesional_id } = req.params;
    const pacientes = await service.obtenerPacientesDelProfesional(profesional_id);
    logger.info('Pacientes obtenidos para profesional %d: %d pacientes', profesional_id, pacientes.length);
    res.status(200).json(pacientes);
  } catch (error) {
    logger.error('Error al obtener pacientes del profesional: %o', error);
    res.status(error.status || 500).json({ error: error.message });
  }
}

async function removerProfesionalColaborador(req, res, service) {
  try {
    const { profesional_id, paciente_id } = req.params;
    
    await service.removerProfesionalColaborador(profesional_id, paciente_id);
    logger.info('Profesional %d removido del paciente %d', profesional_id, paciente_id);
    res.status(200).json({ message: 'Profesional colaborador removido correctamente' });
  } catch (error) {
    logger.error('Error al remover profesional colaborador: %o', error);
    res.status(error.status || 500).json({ error: error.message });
  }
}