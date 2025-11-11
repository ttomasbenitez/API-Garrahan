export class ConfiguracionAlarmaService {
  constructor(configuracionAlarmaRepo) {
    this.configuracionAlarmaRepo = configuracionAlarmaRepo;
  }

  async obtener() {
    return this.configuracionAlarmaRepo.obtener();
  }

  async actualizarLimite(limiteDias) {
    return this.configuracionAlarmaRepo.actualizarLimite(limiteDias);
  }

  async actualizarUltimaEjecucion() {
    return this.configuracionAlarmaRepo.actualizarUltimaEjecucion();
  }
}
