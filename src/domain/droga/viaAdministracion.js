class ViaAdministracion {

  constructor(nombre, codigo, via_id = null) {
    this.nombre = nombre ?? null;
    this.codigo = codigo ?? null;
    this.via_id = via_id ?? null;
  }

}

export default ViaAdministracion;
