export class PacienteService {
  constructor(pacienteRepo, pacienteProfesionalRepo) {
    this.pacienteRepo = pacienteRepo;
    this.pacienteProfesionalRepo = pacienteProfesionalRepo;
  }

  async crear(paciente) {
    const id = await this.pacienteRepo.guardar(paciente);
    paciente.paciente_id = id;
    await this.pacienteProfesionalRepo.asignar(paciente.profesional_id, paciente.paciente_id);
    return id;
  }

  async obtener(id) {
    return this.pacienteRepo.obtener(id);
  }

  async obtenerPorProfesional(paciente_id, profesional_id) {
    return this.pacienteProfesionalRepo.obtenerPacientePorProfesional(paciente_id, profesional_id);
  }

  async obtenerEquipoTratante(paciente_id) {
    return this.pacienteProfesionalRepo.obtenerProfesionalesPorPaciente(paciente_id);
  }

  async cambiarProfesionalPrincipal(paciente_id, nuevo_profesional_id) {
    return this.pacienteProfesionalRepo.cambiarProfesionalPrincipal(paciente_id, nuevo_profesional_id);
  }
}
