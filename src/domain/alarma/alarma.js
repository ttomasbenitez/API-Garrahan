class Alarma {
  constructor(alarma_id, paciente_id, fecha_ultima_receta, dias_transcurridos) {
    this.alarma_id = alarma_id ?? null;
    this.paciente_id = paciente_id ?? null;
    this.fecha_ultima_receta = fecha_ultima_receta ?? null;
    this.dias_transcurridos = dias_transcurridos ?? null;
  }
}

export default Alarma;
