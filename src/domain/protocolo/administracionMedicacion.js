class AdministracionMedicacion {

  constructor(protocolo_id, ciclo_id, regimen, droga_id, via_id, fuerza_valor, fuerza_unidad, cantidad_dias, administracion_diaria, frecuencia_diaria, id_admin = null) {
    // contexto (no debería cambiar en updates)
    this.protocolo_id = Number(protocolo_id);
    this.ciclo_id = Number(ciclo_id);
    this.regimen = Number(regimen);

    // datos propios
    this.droga_id = Number(droga_id) || null;
    this.via_id = Number(via_id) || null;
    this.droga_id = droga_id ?? null;
    this.via_id = via_id ?? null;
    this.fuerza_valor = fuerza_valor ?? null;
    this.fuerza_unidad = fuerza_unidad ?? null;
    this.cantidad_dias = cantidad_dias ?? null;
    this.administracion_diaria = administracion_diaria ?? null;
    this.frecuencia_diaria = frecuencia_diaria ?? null;
    this.id = id_admin ?? null;
  }
}

export default AdministracionMedicacion;
