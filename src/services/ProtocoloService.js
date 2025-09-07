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

  async agregarCiclo(protocoloId, ciclo) {
    const protocolo = await this.protocoloRepo.obtener(protocoloId);
    await protocolo.agregarCiclo(ciclo, this.protocoloRepo);
    return protocolo;
  }

  async agregarCiclos(protocoloId, ciclos) {
    const protocolo = await this.protocoloRepo.obtener(protocoloId);
    for (const ciclo of ciclos) {
      await protocolo.agregarCiclo(ciclo, this.protocoloRepo);
    }
    return protocolo;
  }
}
