class FormaFarmaceutica {
  constructor(nombre, codigo, forma_id = null) {
    this.nombre = nombre ?? null;
    this.codigo = codigo ?? null;
    this.forma_id = forma_id ?? null;
  }
}

export default FormaFarmaceutica;
