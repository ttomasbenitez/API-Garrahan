import ProtocoloPaciente from '../domain/protocoloPaciente.js';
import logger from '../utils/logger.js';
import { ERROR_PACIENTE_PARA_PROTOCOLO_NO_ENCONTRADO, ERROR_CICLO_PARA_PROTOCOLO_NO_ENCONTRADO } from '../errors/protocoloPaciente.js';

export const makeProtocoloPacienteController = (protocoloPacienteService) => ({
  crear: (req, res) => crearProtocolo(req, res, protocoloPacienteService),
  obtenerPorPaciente: (req, res) => obtenerProtocolos(req, res, protocoloPacienteService),
  obtenerEspecifico: (req, res) => obtenerProtocoloEspecifico(req, res, protocoloPacienteService),
  patch: (req, res) => patchProtocoloPaciente(req, res, protocoloPacienteService),
});

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

async function solicitarMasCiclos(req, res, service) {
  try {
    const { protocolo_paciente_id } = req.params;
    const { ciclos_solicitados } = req.body;
    if (!protocolo_paciente_id || ciclos_solicitados === undefined) {
      return res.status(400).json({ error: 'protocolo_paciente_id y ciclos_solicitados son requeridos' });
    }
    const result = await service.solicitarMasCiclos(protocolo_paciente_id, ciclos_solicitados);
    if (!result) {
      return res.status(404).json({ error: 'Protocolo paciente no encontrado' });
    }
    res.status(200).json({ actualizado: true, protocolo_paciente_id, ciclos_solicitados });
  } catch (error) {
    logger.error('Error al solicitar más ciclos: %o', error);
    res.status(500).json({ error: error.message });
  }
}

// PATCH genérico para protocolo paciente
async function patchProtocoloPaciente(req, res, service) {
  try {
    const { protocolo_paciente_id } = req.params;
    const campos = req.body;
    if (!protocolo_paciente_id || !campos || Object.keys(campos).length === 0) {
      return res.status(400).json({ error: 'protocolo_paciente_id y al menos un campo a actualizar son requeridos' });
    }
    const id = await service.updateParcial(protocolo_paciente_id, campos);
    res.status(200).json({ actualizado: true, protocolo_paciente_id: id, campos });
  } catch (error) {
    logger.error('Error al actualizar protocolo paciente: %o', error);
    res.status(500).json({ error: error.message });
  }
}
