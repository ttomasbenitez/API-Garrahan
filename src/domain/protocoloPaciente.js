class ProtocoloPaciente {
  constructor({
    paciente_id,
    protocolo_id,
    regimen,
    ciclo_actual_id,
    numero_ciclo,
    fecha_inicio,
    fecha_fin,
    estado,
    profesional_id_asignador,
    fecha_asignacion,
    protocolo_paciente_id,
    ciclo_final = false,
    repeticiones_actuales = 0,
    cambiar_regimen = false
  }) {
    if (!paciente_id) throw new Error('paciente_id es obligatorio');
    if (!protocolo_id) throw new Error('protocolo_id es obligatorio');
    if (regimen === undefined || regimen === null) throw new Error('regimen es obligatorio');
    if (!ciclo_actual_id) throw new Error('ciclo_actual_id es obligatorio');

    this.protocolo_paciente_id = protocolo_paciente_id ?? null;
    this.paciente_id = paciente_id;
    this.protocolo_id = protocolo_id;
    this.regimen = regimen;
    this.ciclo_actual_id = ciclo_actual_id;
    this.numero_ciclo = numero_ciclo ?? null;
    this.fecha_inicio = fecha_inicio ?? null;
    this.fecha_fin = fecha_fin ?? null;
    this.estado = estado ?? null;
    this.profesional_id_asignador = profesional_id_asignador ?? null;
    this.fecha_asignacion = fecha_asignacion ?? null;
    this.ciclo_final = ciclo_final;
    this.repeticiones_actuales = repeticiones_actuales;
    this.cambiar_regimen = cambiar_regimen;
  }
}

export default ProtocoloPaciente;
