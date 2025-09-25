class AdministracionMedicacion {

  constructor(droga_id, dosis, dosis_unidad, frecuencia, administracion_diaria, frecuencia_diaria, id_admin = null) {
    this.droga_id = droga_id ?? null;
    this.dosis = dosis ?? null;
    this.dosis_unidad = dosis_unidad ?? null;
    this.frecuencia = frecuencia ?? null;
    this.administracion_diaria = administracion_diaria ?? 0;
    this.frecuencia_diaria = frecuencia_diaria ?? null;
    this.id = id_admin ?? null;
  }
}

export default AdministracionMedicacion;
