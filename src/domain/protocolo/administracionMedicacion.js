class AdministracionMedicacion {

  constructor(id_droga, dosis, dosis_unidad, frecuencia, administracion_diaria, frecuencia_diaria, id_admin = null) {
    this.id_droga = id_droga ?? null;
    this.dosis = dosis ?? null;
    this.dosis_unidad = dosis_unidad ?? null;
    this.frecuencia = frecuencia ?? null;
    this.administracion_diaria = administracion_diaria ?? 0;
    this.frecuencia_diaria = frecuencia_diaria ?? null;
    this.id_admin = id_admin ?? null;
  }
}

export default AdministracionMedicacion;
