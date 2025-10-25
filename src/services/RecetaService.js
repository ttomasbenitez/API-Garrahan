
export class RecetaService {

  constructor(recetaPacienteRepo) {
    this.recetaPacienteRepo = recetaPacienteRepo;
  }

  async crearRecetaPaciente(receta) {
    return await this.recetaPacienteRepo.guardar(receta);
  }

  async obtenerRecetaPaciente(id) {
    return await this.recetaPacienteRepo.obtener(id);
  }
}
