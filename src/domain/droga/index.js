class Droga {

  constructor(nombre_generico, codigo_farmacia, droga_id = null) {
    this.nombre_generico = nombre_generico ?? null;
    this.codigo_farmacia = codigo_farmacia ?? null;
    this.droga_id = droga_id ?? null;
  }

}

export default Droga;
