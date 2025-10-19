class PresentacionDroga {
  constructor(droga_id, forma_farmaceutica_id, estado = null, fuerza_valor = null, fuerza_unidad = null, presentacion_id = null) {
    this.droga_id = droga_id ?? null;
    this.forma_farmaceutica_id = forma_farmaceutica_id ?? null;
    this.estado = estado ?? null;
    this.fuerza_valor = fuerza_valor ?? null;
    this.fuerza_unidad = fuerza_unidad ?? null;
    this.presentacion_id = presentacion_id ?? null;
  }
}

export default PresentacionDroga;
