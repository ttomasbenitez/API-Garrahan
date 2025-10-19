export class PresentacionDrogaViaService {
  constructor(presentacionDrogaViaRepo) {
    this.presentacionDrogaViaRepo = presentacionDrogaViaRepo;
  }

  async crear(presentacionesVia) {
    return await this.presentacionDrogaViaRepo.guardar(presentacionesVia);
  }

  async obtener(via_id, presentacion_id) {
    return await this.presentacionDrogaViaRepo.obtener(via_id, presentacion_id);
  }

  async listarPorPresentacion(presentacion_id) {
    return await this.presentacionDrogaViaRepo.listarPorPresentacion(presentacion_id);
  }

  async eliminar(via_id, presentacion_id) {
    return await this.presentacionDrogaViaRepo.eliminar(via_id, presentacion_id);
  }
}
