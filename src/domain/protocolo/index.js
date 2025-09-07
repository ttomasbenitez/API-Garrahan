class Protocolo {

  constructor(nombre, enfermedad, linea, id) {
    this.nombre = nombre;
    this.enfermedad = enfermedad;
    this.linea = linea;
    this.protocolo_id = id;
  }

  static fromRow(row) {
    return new Protocolo(row[1], row[2], row[3], row[0]);
  }
}

export default Protocolo;
