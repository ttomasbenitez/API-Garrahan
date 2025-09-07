export class ProtocoloService {
  constructor(protocoloRepo) {
    this.protocoloRepo = protocoloRepo;
  }

  async crear(protocolo) {
    const id = await this.protocoloRepo.guardar(protocolo);
    protocolo.protocolo_id = id;
    return id;
  }

  async obtener(id) { return this.protocoloRepo.obtener(id); }
}
