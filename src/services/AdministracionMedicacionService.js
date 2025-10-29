export class AdministracionMedicacionService {
  constructor(repositorio) {
    this.repositorio = repositorio;
  }

  async obtenerPorId(admin_id) {
    return await this.repositorio.getById(admin_id);
  }
}
