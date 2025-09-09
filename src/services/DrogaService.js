export class DrogaService {

  constructor(drogaRepo) {
    this.drogaRepo = drogaRepo;
  }

  async crear(drogas) {

    const ids = await this.drogaRepo.guardar(drogas);
    drogas.forEach((droga, index) => {
      droga.id_droga = ids[index];
    });

    return ids;
  }

  async obtener(idDroga) {
    return await this.drogaRepo.obtener(idDroga);
  }
}
