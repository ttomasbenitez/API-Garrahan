import ValidadorProtocolo from '../domain/validadores/validadorProtocolo.js';

export class ProtocoloService {
  constructor(protocoloRepo, administracionMedicacionRepo) {
    this.protocoloRepo = protocoloRepo;
    this.administracionMedicacionRepo = administracionMedicacionRepo;
    this.validadorProtocolo = new ValidadorProtocolo();
  }

  async crear(protocolo) {
    const id = await this.protocoloRepo.guardar(protocolo);
    protocolo.protocolo_id = id;
    return id;
  }

  async obtener(id) {
    return this.protocoloRepo.obtener(id);
  }

  async obtenerTodos() { return this.protocoloRepo.obtenerTodos(); }

  async agregarCiclo(protocoloId, ciclo) {
    const protocolo = await this.obtener(protocoloId);
    await protocolo.agregarCiclo(ciclo, this.protocoloRepo);
    return protocolo;
  }

  async agregarCiclos(protocoloId, ciclos) {
    const protocolo = await this.obtener(protocoloId);
    await protocolo.agregarCiclo(ciclos, this.protocoloRepo);
    return protocolo;
  }

  async agregarAdministracion(protocolo, ciclo, administracion_medicaciones) {
    await protocolo.agregarAdministracion(ciclo, administracion_medicaciones, this.administracionMedicacionRepo);
    return protocolo;
  }

  validarProtocolo(payload) {
    return this.validadorProtocolo.validar(payload);
  }
}
