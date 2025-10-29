class FormaFarmaceutica {
  constructor(nombre, codigo, forma_farmaceutica_id = null) {
    this.nombre = nombre ?? null;
    this.codigo = codigo ?? null;
    this.forma_farmaceutica_id = forma_farmaceutica_id ?? null;
  }
}

export default FormaFarmaceutica;
