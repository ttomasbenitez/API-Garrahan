class Protocolo {

  constructor(nombre, enfermedad, linea) {
    this.nombre = nombre;
    this.enfermedad = enfermedad;
    this.linea = linea;
  }

  static fromRow(row) {
    return new Protocolo(row.nombre, row.enfermedad, row.linea);
  }
}

export default Protocolo;
