export class PacienteService {
  constructor(pacienteRepo) {
    this.pacienteRepo = pacienteRepo;
  }

  async crear(paciente) {
    const id = await this.pacienteRepo.guardar(paciente);
    paciente.id = id;
    return id;
  }

  async obtener(id) { 
    return this.pacienteRepo.obtener(id); 
  }

  async obtenerEquipoTratante(paciente_id) {
    return this.pacienteRepo.pacienteProfesionalRepo.obtenerProfesionalesPorPaciente(paciente_id);
  }

  async cambiarProfesionalPrincipal(paciente_id, nuevo_profesional_id) {
    return this.pacienteRepo.cambiarProfesionalPrincipal(paciente_id, nuevo_profesional_id);
  }
}
