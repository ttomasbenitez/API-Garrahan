import { ERROR_CAMPOS_REQUERIDOS } from '../errors/index.js';
import {
  ERROR_PROFESIONAL_YA_ASIGNADO,
  MSG_PROFESIONAL_AGREGADO,
  MSG_PROFESIONAL_PRINCIPAL_CAMBIADO,
  MSG_EQUIPO_OBTENIDO,
  MSG_PACIENTES_OBTENIDOS,
} from '../errors/pacienteProfesional.js';
import logger from '../utils/logger.js';

export class PacienteProfesionalService {
  constructor(pacienteProfesionalRepo, pacienteService, profesionalService) {
    this.pacienteProfesionalRepo = pacienteProfesionalRepo;
    this.pacienteService = pacienteService;
    this.profesionalService = profesionalService;
  }

  async agregarProfesionalColaborador(profesional_id, paciente_id, rol = 'Colaborador') {
    if (!profesional_id || !paciente_id) {
      throw new Error(ERROR_CAMPOS_REQUERIDOS);
    }

    // Validar que existan
    await this.pacienteService.obtener(paciente_id);
    await this.profesionalService.obtener(profesional_id);

    // Verificar que no exista ya la asignación
    const existe = await this.pacienteProfesionalRepo.existeAsignacion(profesional_id, paciente_id);
    if (existe) {
      throw new Error(ERROR_PROFESIONAL_YA_ASIGNADO);
    }

    logger.info(MSG_PROFESIONAL_AGREGADO(profesional_id, paciente_id));
    return await this.pacienteProfesionalRepo.asignar(profesional_id, paciente_id, rol);
  }

  async cambiarProfesionalPrincipal(paciente_id, nuevo_profesional_id) {
    if (!paciente_id || !nuevo_profesional_id) {
      throw new Error(ERROR_CAMPOS_REQUERIDOS);
    }

    // Validar que existan
    await this.pacienteService.obtener(paciente_id);
    await this.profesionalService.obtener(nuevo_profesional_id);

    // Cambiar profesional principal (actualiza paciente.profesional_id y paciente_profesional)
    const resultado = await this.pacienteService.cambiarProfesionalPrincipal(paciente_id, nuevo_profesional_id);
    logger.info(MSG_PROFESIONAL_PRINCIPAL_CAMBIADO(paciente_id, nuevo_profesional_id));
    return resultado;
  }

  async obtenerEquipoTratante(paciente_id) {
    await this.pacienteService.obtener(paciente_id); // Validar que existe
    const equipo = await this.pacienteProfesionalRepo.obtenerProfesionalesPorPaciente(paciente_id);
    logger.info(MSG_EQUIPO_OBTENIDO(paciente_id, equipo.length));
    return equipo;
  }

  async obtenerPacientesDelProfesional(profesional_id) {
    await this.profesionalService.obtener(profesional_id); // Validar que existe
    const pacientes = await this.pacienteProfesionalRepo.obtenerPacientesPorProfesional(profesional_id);
    logger.info(MSG_PACIENTES_OBTENIDOS(profesional_id, pacientes.length));
    return pacientes;
  }

  async removerProfesionalColaborador(profesional_id, paciente_id) {
    if (!profesional_id || !paciente_id) {
      throw new Error(ERROR_CAMPOS_REQUERIDOS);
    }

    // Obtener equipo actual
    const equipo = await this.obtenerEquipoTratante(paciente_id);

    // Verificar que no sea el médico tratante
    const profesionalARemover = equipo.find(p => p.profesional_id.toString() === profesional_id.toString());
    if (profesionalARemover && profesionalARemover.rol === 'Médico Tratante') {
      const error = new Error('No se puede remover al médico tratante. Use cambiar profesional principal.');
      error.status = 400;
      throw error;
    }

    return await this.pacienteProfesionalRepo.remover(profesional_id, paciente_id);
  }
}
