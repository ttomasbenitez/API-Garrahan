export class ProfesionalService {
  constructor(profesionalRepo) {
    this.profesionalRepo = profesionalRepo;
  }

  async crear(profesional) {
    const id = await this.profesionalRepo.guardar(profesional);
    profesional.id = id;
    return id;
  }

  async obtener(id) { return this.profesionalRepo.obtener(id); }
}
