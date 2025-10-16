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
}
