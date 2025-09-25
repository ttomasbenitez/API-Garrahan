class Protocolo {

  constructor(nombre, enfermedad, linea, id = null) {
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
    this.ciclos.push(...ciclo);
  }

  validarCicloEnRegimen(cicloId, regimen) {
    if (!this.ciclos || this.ciclos.length === 0) {
      throw new Error('El protocolo no tiene ciclos definidos');
    }
    const ciclo = this.ciclos.find(c => c.id === cicloId && c.regimen === regimen);
    if (!ciclo) {
      throw new Error(`No se encontró el ciclo ${cicloId} en el régimen ${regimen} del protocolo ${this.protocolo_id}`);
    }
    return ciclo;
  }

  async agregarAdministracion(ciclo, administracion_medicaciones, repositorioProtocolo) {
    const ids = await repositorioProtocolo.agregarAdministracion(this, ciclo, administracion_medicaciones);
    administracion_medicaciones.forEach((adm, index) => {
      adm.id = ids[index];
    });
    ciclo.agregarAdministracion(administracion_medicaciones, repositorioProtocolo);
  }
}

export default Protocolo;
