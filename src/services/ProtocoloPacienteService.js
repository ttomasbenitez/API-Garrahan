export class ProtocoloPacienteService {

  constructor(protocoloPacienteRepo) {
    this.protocoloPacienteRepo = protocoloPacienteRepo;
  }

  // Asignar un protocolo a un paciente
  async crear(protocoloPaciente) {
    const id = await this.protocoloPacienteRepo.guardar(protocoloPaciente);
    protocoloPaciente.protocolo_paciente_id = id;
    return id;
  }

  // Obtener todos los protocolos de un paciente, o uno específico si se pasa protocolo_id
  async obtenerPorPaciente(paciente_id, protocolo_id = null) {
    return this.protocoloPacienteRepo.obtenerPorPaciente(paciente_id, protocolo_id);
  }

  // Actualizar el régimen de un protocolo_paciente
  async updateRegimen(protocolo_paciente_id, nuevo_regimen) {
    return this.protocoloPacienteRepo.updateRegimen(protocolo_paciente_id, nuevo_regimen);
  }

  // Solicitar más ciclos para un paciente
  async solicitarMasCiclos(protocolo_paciente_id, ciclos_solicitados) {
    // Obtener el protocolo_paciente actual
    const protocolos = await this.protocoloPacienteRepo.obtenerPorPaciente(null, protocolo_paciente_id);
    if (!protocolos || protocolos.length === 0) return false;
    const protocolo = protocolos[0];
    let updated = false;
    if (!protocolo.ciclo_final) {
      // Sumar a ciclo_actual_id
      const nuevo_ciclo_actual_id = Number(protocolo.ciclo_actual_id) + Number(ciclos_solicitados);
      updated = await this.protocoloPacienteRepo.updateCicloActualId(protocolo_paciente_id, nuevo_ciclo_actual_id);
    } else {
      // Sumar a repeticiones_actuales
      const nuevas_repeticiones = Number(protocolo.repeticiones_actuales || 0) + Number(ciclos_solicitados);
      updated = await this.protocoloPacienteRepo.updateRepeticionesActuales(protocolo_paciente_id, nuevas_repeticiones);
    }
    return updated;
  }

}
