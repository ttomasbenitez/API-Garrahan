import ProtocoloPaciente from '../domain/protocoloPaciente.js';
import logger from '../utils/logger.js';
import { ERROR_PACIENTE_PARA_PROTOCOLO_NO_ENCONTRADO, ERROR_CICLO_PARA_PROTOCOLO_NO_ENCONTRADO } from '../errors/protocoloPaciente.js';

export const makeProtocoloPacienteController = (protocoloPacienteService) => ({
  crear: (req, res) => crearProtocolo(req, res, protocoloPacienteService),
  obtenerPorPaciente: (req, res) => obtenerProtocolos(req, res, protocoloPacienteService),
  obtenerEspecifico: (req, res) => obtenerProtocoloEspecifico(req, res, protocoloPacienteService),
  updateRegimen: (req, res) => updateRegimen(req, res, protocoloPacienteService),
});

async function updateRegimen(req, res, service) {
  try {
    const { protocolo_paciente_id } = req.params;
    const { regimen } = req.body;
    if (!protocolo_paciente_id || regimen === undefined) {
      return res.status(400).json({ error: 'protocolo_paciente_id y regimen son requeridos' });
    }
    const ok = await service.updateRegimen(protocolo_paciente_id, regimen);
    if (!ok) {
      return res.status(404).json({ error: 'Protocolo paciente no encontrado' });
    }
    res.status(200).json({ actualizado: true, protocolo_paciente_id, regimen });
  } catch (error) {
    logger.error('Error al actualizar regimen de protocolo paciente: %o', error);
    res.status(500).json({ error: error.message });
  }
}

async function crearProtocolo(req, res, service) {
  try {
    const profesional_id_asignador = req.user.id;
    const { paciente_id } = req.params;
    const { protocolo_id, regimen, ciclo_actual_id, numero_ciclo, fecha_inicio, fecha_fin, estado, fecha_asignacion } = req.body;

    if (!protocolo_id || regimen === undefined || !ciclo_actual_id || !profesional_id_asignador) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const pp = new ProtocoloPaciente({
      paciente_id: Number(paciente_id),
      protocolo_id: Number(protocolo_id),
      regimen: Number(regimen),
      ciclo_actual_id: Number(ciclo_actual_id),
      numero_ciclo: Number(numero_ciclo) ,
      fecha_inicio: fecha_inicio ? new Date(fecha_inicio) : null,
      fecha_fin: fecha_fin ? new Date(fecha_fin) : null,
      estado,
      profesional_id_asignador: Number(profesional_id_asignador),
      fecha_asignacion: fecha_asignacion ? new Date(fecha_asignacion) : new Date()
    });

    const id = await service.crear(pp);
    logger.info('ProtocoloPaciente creado con ID: %d', id);
    res.status(201).json({ protocolo_paciente_id: id });
  } catch (error) {
    logger.error('Error al asignar protocolo: %o', error);
    if (error.message === ERROR_PACIENTE_PARA_PROTOCOLO_NO_ENCONTRADO ||
      error.message === ERROR_CICLO_PARA_PROTOCOLO_NO_ENCONTRADO) {
      res.status(404).json({ error: error.message });
    }
    else {
      res.status(500).json({ error: error.message });
    }
  }
}

async function obtenerProtocolos(req, res, service) {
  try {
    const { paciente_id } = req.params;
    const protocolos = await service.obtenerPorPaciente(Number(paciente_id));
    logger.info('Protocolos obtenidos para paciente ID: %d', paciente_id);
    res.status(200).json(protocolos);
  } catch (error) {
    logger.error('Error al obtener protocolos: %o', error);
    res.status(500).json({ error: error.message });
  }
}

async function obtenerProtocoloEspecifico(req, res, service) {
  try {
    const { paciente_id, protocolo_id } = req.params;
    const protocolos = await service.obtenerPorPaciente(Number(paciente_id), Number(protocolo_id));
    logger.info('Protocolo específico obtenido para paciente ID: %d, protocolo ID: %d', paciente_id, protocolo_id);
    res.status(200).json(protocolos[0] || null);
  } catch (error) {
    logger.error('Error al obtener protocolo específico: %o', error);
    res.status(500).json({ error: error.message });
  }
}
