const ES_CICLO_FINAL = 1;

class Ciclo {

  constructor(ciclo_id, protocolo_id, regimen, duracion_semanas, ciclo_final, repeticiones) {
    this.ciclo_id = ciclo_id;
    this.protocolo_id = protocolo_id;
    this.regimen = regimen;
    this.duracion_semanas = duracion_semanas;
    this.ciclo_final = ciclo_final;
    this.repeticiones = repeticiones;
    this.administracion_medicacion = [];
  }

  static fromRow(row) {
    return new Ciclo(
      row.CICLO_ID,
      row.PROTOCOLO_ID,
      row.REGIMEN,
      row.DURACION_SEMANAS,
      row.CICLO_FINAL === ES_CICLO_FINAL,
      row.REPETICIONES
    );
  }


  agregarAdministracion(administracion_medicaciones) {
    if (!this.administracion_medicacion) {
      this.administracion_medicacion = [];
    }
    this.administracion_medicacion.push(...administracion_medicaciones);
  }
}

export default Ciclo;
