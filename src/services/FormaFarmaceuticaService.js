export class FormaFarmaceuticaService {
  constructor(formaFarmaceuticaRepo) {
    this.formaFarmaceuticaRepo = formaFarmaceuticaRepo;
  }
  async crear(formasFarmaceuticas) {
    const ids = await this.formaFarmaceuticaRepo.guardar(formasFarmaceuticas);
    formasFarmaceuticas.forEach((formaFarmaceutica, index) => {
      formaFarmaceutica.forma_farmaceutica_id = ids[index];
    });
    return ids;
  }
  async obtener(formaFarmaceuticaId) {
    return await this.formaFarmaceuticaRepo.obtener(formaFarmaceuticaId);
  }
  async listar() {
    return await this.formaFarmaceuticaRepo.listar();
  }

  async actualizar(id, datos) {
    return await this.formaFarmaceuticaRepo.actualizar(id, datos);
  }

  async eliminar(id) {
    return await this.formaFarmaceuticaRepo.eliminar(id);
  }
}
