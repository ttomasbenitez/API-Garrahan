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

  async guardar(repositorioProtocolo) {
    try {
      this.protocolo_id = await repositorioProtocolo.guardar(this);
      return this.protocolo_id;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async agregarCiclo(ciclo, repositorioProtocolo) {
    if (!this.ciclos) {
      this.ciclos = [];
    }
    this.ciclos.push(ciclo);
    await repositorioProtocolo.agregarCiclo(this.protocolo_id, ciclo);
  }
}

export default Protocolo;
