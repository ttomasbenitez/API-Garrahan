import ProtocoloPaciente from '../domain/protocoloPaciente.js';

export class ProtocoloPacienteService {

  constructor(protocoloPacienteRepo, protocoloRepo) {
    this.protocoloPacienteRepo = protocoloPacienteRepo;
    this.protocoloRepo = protocoloRepo;
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

  async actualizarCicloActual(pacienteId, protocoloPacienteId) {
    const protocolos = await this.protocoloPacienteRepo.obtenerPorPaciente(pacienteId, protocoloPacienteId);
    const original = protocolos[0];
    const protocoloPaciente = new ProtocoloPaciente({ ...original });
    console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAA');

    const protocolo = await this.protocoloRepo.obtener(protocoloPaciente.protocolo_id);


    if (!protocoloPaciente.esCicloFinal()) {
      if (protocolo.cicloSiguienteTieneRegimenDistinto(protocoloPaciente.ciclo_actual_id, protocoloPaciente.regimen)) {
        protocoloPaciente.actualizarCambiarRegimen();
      }
      protocoloPaciente.actualizarCicloActual();

      if (protocolo.esCicloFinal(protocoloPaciente.ciclo_actual_id)) {
        protocoloPaciente.actualizarCicloFinal();
      }
    }
    console.log('BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB');

    console.log(JSON.stringify(original, null, 2));
    console.log(JSON.stringify(protocoloPaciente, null, 2));

    // Comparar campos modificados
    const cambios = {};
    for (const key of Object.keys(protocoloPaciente)) {
      if (protocoloPaciente[key] !== original[key]) {
        cambios[key] = protocoloPaciente[key];
      }
    }

    if (Object.keys(cambios).length > 0) {
      console.log('ENTRAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
      await this.protocoloPacienteRepo.actualizarParcialmente(protocoloPacienteId, cambios);
    }
    console.log('CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC');

    return protocoloPacienteId;
  }

  // Actualización parcial de protocolo_paciente
  async updateParcial(protocolo_paciente_id, campos) {
    return this.protocoloPacienteRepo.actualizarParcialmente(protocolo_paciente_id, campos);
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
