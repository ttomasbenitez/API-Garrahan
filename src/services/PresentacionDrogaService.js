export class PresentacionDrogaService {
  constructor(presentacionDrogaRepo) {
    this.presentacionDrogaRepo = presentacionDrogaRepo;
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

  async listar() {
    return await this.presentacionDrogaRepo.listar();
  }

  async eliminar(id) {
    return await this.presentacionDrogaRepo.eliminar(id);
  }
}
