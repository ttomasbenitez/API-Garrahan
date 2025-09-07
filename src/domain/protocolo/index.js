class Protocolo {

  constructor(nombre, enfermedad, linea, id) {
    this.nombre = nombre;
    this.enfermedad = enfermedad;
    this.linea = linea;
    this.protocolo_id = id;
    this.ciclos = [];
  }

  static fromRow(row, ciclos = []) {
    const protocolo = new Protocolo(row[1], row[2], row[3], row[0]);
    protocolo.ciclos = ciclos;
    return protocolo;
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
    await repositorioProtocolo.agregarCiclo(this.protocolo_id, ciclo);
    this.ciclos.push(ciclo);
  }
}

export default Protocolo;
