export class DrogaService {

  constructor(drogaRepo) {
    this.drogaRepo = drogaRepo;
  }

  async crear(droga) {
    const id = await this.drogaRepo.guardar(droga);
    droga.id_droga = id;
    return id;
  }
}
