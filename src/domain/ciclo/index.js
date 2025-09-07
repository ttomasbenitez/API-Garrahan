const ES_CICLO_FINAL = 1;

class Ciclo {

  constructor(id, protocolo_id, regimen, duracion_semanas, ciclo_final) {
    this.id = id;
    this.protocolo_id = protocolo_id;
    this.regimen = regimen;
    this.duracion_semanas = duracion_semanas;
    this.ciclo_final = ciclo_final;
  }

  static fromRow(row) {
    return new Ciclo(
      row[0],
      row[1],
      row[2],
      row[3],
      row[4] === ES_CICLO_FINAL,
    );
  }
}

export default Ciclo;
