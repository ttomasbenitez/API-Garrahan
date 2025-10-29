export class PacienteService {
  constructor(pacienteRepo, pacienteProfesionalRepo, apiHospitalConector) {
    this.pacienteRepo = pacienteRepo;
    this.pacienteProfesionalRepo = pacienteProfesionalRepo;
    this.apiHospitalConector = apiHospitalConector;
  }

  async crear(paciente, profesional_id) {
    const id = await this.pacienteRepo.guardar(paciente);
    paciente.paciente_id = id;
    await this.pacienteProfesionalRepo.asignar(profesional_id, paciente.paciente_id);
    return id;
  }

  async obtener(id) {
    return this.pacienteRepo.obtener(id);
  }

  async obtenerTodos() { return this.pacienteRepo.obtenerTodos(); }

  async actualizarParcialmente(paciente_id, campos) {
    return this.pacienteRepo.actualizarParcialmente(paciente_id, campos);
  }

  async obtenerExterno(id) {
    return this.apiHospitalConector.obtenerPaciente(id);
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
