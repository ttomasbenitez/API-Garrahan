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
}
