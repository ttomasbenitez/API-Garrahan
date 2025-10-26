class ProtocoloActualDTO {
  constructor(protocolo_id, nombre, regimen, ciclo_actual_id, administraciones = []) {
    this.protocolo_id = protocolo_id;
    this.nombre = nombre;
    this.regimen = regimen;
    this.ciclo_actual_id = ciclo_actual_id;
    this.administraciones = administraciones;
  }
}

export default ProtocoloActualDTO;
