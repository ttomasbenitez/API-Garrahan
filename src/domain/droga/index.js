class Droga {

  constructor(medicamento, presentacion, dosis, dosis_unidad, dosis_maxima, dosis_maxima_unidad) {
    this.medicamento = medicamento ?? null;
    this.presentacion = presentacion ?? null;
    this.dosis = dosis ?? null;
    this.dosis_unidad = dosis_unidad ?? null;
    this.dosis_maxima = dosis_maxima ?? null;
    this.dosis_maxima_unidad = dosis_maxima_unidad ?? null;
    this.id_droga = null;
  }
}

export default Droga;
