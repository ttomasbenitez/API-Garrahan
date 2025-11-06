class Protocolo {

  constructor(nombre, enfermedad, linea, cantidad_regimenes, protocolo_id = null, ciclos = []) {
    this.nombre = nombre;
    this.enfermedad = enfermedad;
    this.linea = linea;
    this.cantidad_regimenes = cantidad_regimenes;
    this.protocolo_id = protocolo_id;
    this.ciclos = ciclos;
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
    const ciclo = this.ciclos.find(c => c.ciclo_id === cicloId && c.regimen === regimen);
    if (!ciclo) {
      throw new Error(`No se encontró el ciclo ${cicloId} en el régimen ${regimen} del protocolo ${this.protocolo_id}`);
    }
    return ciclo;
  }

  async agregarAdministracion(ciclo, administracion_medicaciones, administracionMedicacionRepo) {
    const ids = await administracionMedicacionRepo.guardar(administracion_medicaciones);
    administracion_medicaciones.forEach((adm, index) => {
      adm.id = ids[index];
    });
    ciclo.agregarAdministracion(administracion_medicaciones);
  }

  // Devuelve false si el ciclo recibido es menor a alguno del protocolo.
  // Devuelve true si no hay ningún ciclo_id mayor, por lo que es el último.
  esCicloFinal(ciclo) {
    const hayMayor = this.ciclos.some(c => c.ciclo_id > ciclo);
    return !hayMayor;
  }

  cicloSiguienteTieneRegimenDistinto(ciclo_id, regimen) {
    const siguientes = this.ciclos.filter(c => c.ciclo_id === ciclo_id + 1);
    return siguientes.some(c => c.regimen !== regimen);
  }
}

export default Protocolo;
