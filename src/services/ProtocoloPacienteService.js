import ProtocoloPaciente from '../domain/protocoloPaciente.js';
import {ERROR_PROTOCOLO_PACIENTE_NO_ENCONTRADO} from '../errors/protocoloPaciente.js';

export class ProtocoloPacienteService {

  constructor(protocoloPacienteRepo, protocoloRepo) {
    this.protocoloPacienteRepo = protocoloPacienteRepo;
    this.protocoloRepo = protocoloRepo;
  }

  // Asignar un protocolo a un paciente
  async crear(protocoloPaciente) {
    let protocolosExistentes = [];
    try {
      protocolosExistentes = await this.protocoloPacienteRepo.obtenerPorPaciente(protocoloPaciente.paciente_id);
    } catch (err) {
      if (err.message !== ERROR_PROTOCOLO_PACIENTE_NO_ENCONTRADO) {
        throw err;
      }
    }

    if (protocoloPaciente.estado === 'Activo') {
      // Verificar si el paciente ya tiene otro protocolo activo
      const yaActivo = protocolosExistentes.find(p => p.estado === 'Activo');
      if (yaActivo) {
        throw new Error('El paciente ya tiene un protocolo activo. Solo puede haber uno activo por paciente.');
      }
    }

    // Buscar si ya existe una relación con el mismo protocolo_id y regimen
    const existente = protocolosExistentes.find(p =>
      p.protocolo_id === protocoloPaciente.protocolo_id
      // && p.regimen === protocoloPaciente.regimen TODO: chequear si es necesario incluir el regimen tambien
    );

    if (existente) {
      // Si ya existe y estaba inactivo, y el nuevo viene como activo → actualizarlo
      if (existente.estado === 'Inactivo' && protocoloPaciente.estado === 'Activo') {
        await this.protocoloPacienteRepo.actualizarParcialmente(existente.protocolo_paciente_id, {
          estado: 'Activo',
          regimen: protocoloPaciente.regimen,
          fecha_asignacion: new Date(),
          profesional_id_asignador: protocoloPaciente.profesional_id_asignador
        });
        return existente.protocolo_paciente_id;
      }

      // Si ya existía y sigue con el mismo estado o cualquier otro caso → error de duplicado lógico
      throw new Error('El paciente ya tiene asignado este protocolo');
    }

    // Si no existía, crear uno nuevo
    const id = await this.protocoloPacienteRepo.guardar(protocoloPaciente);
    protocoloPaciente.protocolo_paciente_id = id;
    return id;
  }

  // Obtener todos los protocolos de un paciente, o uno específico si se pasa protocolo_id
  async obtenerPorPaciente(paciente_id, protocolo_id = null) {
    return this.protocoloPacienteRepo.obtenerPorPaciente(paciente_id, protocolo_id);
  }

  async actualizarCicloActual(pacienteId) {
    const protocolos = await this.protocoloPacienteRepo.obtenerPorPaciente(pacienteId);
    const original = protocolos[0];
    const protocoloPaciente = new ProtocoloPaciente({ ...original });

    const protocolo = await this.protocoloRepo.obtener(protocoloPaciente.protocolo_id);


    if (protocolo.cicloSiguienteTieneRegimenDistinto(protocoloPaciente.ciclo_actual_id, protocoloPaciente.regimen)) {
      protocoloPaciente.actualizarCambiarRegimen();
    }

    protocoloPaciente.actualizarCicloActual();

    if (!protocoloPaciente.esCicloFinal()) {
      if (protocolo.esCicloFinal(protocoloPaciente.ciclo_actual_id)) {
        protocoloPaciente.actualizarCicloFinal();
      }
    }

    // Comparar campos modificados
    const cambios = {};
    for (const key of Object.keys(protocoloPaciente)) {
      if (protocoloPaciente[key] !== original[key]) {
        cambios[key] = protocoloPaciente[key];
      }
    }

    if (Object.keys(cambios).length > 0) {
      await this.protocoloPacienteRepo.actualizarParcialmente(protocoloPaciente.protocolo_paciente_id, cambios);
    }

    return protocoloPaciente.protocolo_paciente_id;
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
