class Droga {

  constructor(medicamento, presentacion, dosis, dosis_unidad, dosis_maxima, dosis_maxima_unidad, volumen_ml_por_dosis = null, id_droga = null) {
    this.medicamento = medicamento ?? null;
    this.presentacion = presentacion ?? null;
    this.dosis = dosis ?? null;
    this.dosis_unidad = dosis_unidad ?? null;
    this.dosis_maxima = dosis_maxima ?? null;
    this.dosis_maxima_unidad = dosis_maxima_unidad ?? null;
    this.volumen_ml_por_dosis = volumen_ml_por_dosis ?? null;
    this.id_droga = id_droga ?? null;
  }

}

export default Droga;
