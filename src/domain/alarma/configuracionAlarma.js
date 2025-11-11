class ConfiguracionAlarma {
  constructor(configuracion_id, limite_dias, ultima_ejecucion) {
    this.configuracion_id = configuracion_id ?? null;
    this.limite_dias = limite_dias ?? null;
    this.ultima_ejecucion = ultima_ejecucion ?? null;
  }
}

export default ConfiguracionAlarma;
