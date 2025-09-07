export class PacienteService {
  constructor(pacienteRepo) {
    this.pacienteRepo = pacienteRepo;
  }

  async crear(paciente) {
    const id = await this.pacienteRepo.guardar(paciente);
    paciente.paciente_id = id;
    return id;
  }

  async obtener(id) { return this.pacienteRepo.obtener(id); }
}
