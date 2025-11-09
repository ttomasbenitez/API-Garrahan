class ProtocoloActualDTO {
  constructor(protocolo_id, protocoloPacienteId, nombre, regimen, cambiar_regimen, ciclo_actual_id, administraciones = []) {
    this.protocolo_id = protocolo_id;
    this.protocoloPacienteId = protocoloPacienteId;
    this.nombre = nombre;
    this.regimen = regimen;
    this.cambiar_regimen = cambiar_regimen;
    this.ciclo_actual_id = ciclo_actual_id;
    this.administraciones = administraciones;
  }
}

export default ProtocoloActualDTO;
