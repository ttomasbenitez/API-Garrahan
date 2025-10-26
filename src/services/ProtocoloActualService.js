export class ProtocoloActualService {
  constructor(protocoloActualRepo) {
    this.protocoloActualRepo = protocoloActualRepo;
  }

  async obtenerDatos(pacienteId) {
    return this.protocoloActualRepo.obtenerProtocoloActualDetallado(pacienteId);
  }
}
