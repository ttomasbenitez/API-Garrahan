export class ViaAdministracionService {

  constructor(viaAdministracionRepo) {
    this.viaAdministracionRepo = viaAdministracionRepo;
  }

  async crear(viasAdministracion) {

    const ids = await this.viaAdministracionRepo.guardar(viasAdministracion);

    viasAdministracion.forEach((via, index) => {
      via.via_id = ids[index];
    });

    return ids;
  }

  async obtener(idViaAdministracion) {
    return await this.viaAdministracionRepo.obtener(idViaAdministracion);
  }

}
