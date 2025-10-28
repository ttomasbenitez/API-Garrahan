export class PresentacionDrogaService {
  constructor(presentacionDrogaRepo, presentacionDrogaConFormaRepo) {
    this.presentacionDrogaRepo = presentacionDrogaRepo;
    this.presentacionDrogaConFormaRepo = presentacionDrogaConFormaRepo;
  }

  async crear(presentaciones) {
    const ids = await this.presentacionDrogaRepo.guardar(presentaciones);
    presentaciones.forEach((p, i) => {
      p.presentacion_id = ids[i];
    });
    return ids;
  }

  async obtener(id) {
    return await this.presentacionDrogaRepo.obtener(id);
  }

  async listar(droga_id) {
    return await this.presentacionDrogaConFormaRepo.listar(droga_id);
  }

  async eliminar(id) {
    return await this.presentacionDrogaRepo.eliminar(id);
  }
}
