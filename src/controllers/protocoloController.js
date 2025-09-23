import Ciclo from '../domain/protocolo/ciclo.js';
import Protocolo from '../domain/protocolo/index.js';
import { ERROR_CAMPOS_REQUERIDOS } from '../errors/index.js';
import logger from '../utils/logger.js';

export const makeProtocoloController = (protocoloService, drogaService) => ({
  crear: (req, res) => crearProtocolo(req, res, protocoloService),
  obtener: (req, res) => obtenerProtocolo(req, res, protocoloService),
  agregarCiclo: (req, res) => agregarCiclo(req, res, protocoloService),
  agregarAdministracion: (req, res) => agregarAdministracion(req, res, protocoloService, drogaService),
});


async function crearProtocolo(req, res, service) {
  try {
    const payload = service.validarProtocolo(req.body);
    const protocolo = new Protocolo(payload.nombre, payload.enfermedad, payload.linea);
    await service.crear(protocolo);
    logger.info('Protocolo creado con ID: %d', protocolo.protocolo_id);
    res.status(201).json(protocolo);
  } catch (error) {
    logger.error('Error al crear protocolo: %o', error);
    res.status(error.status || 500).json({ error: error.message, message: error.details ?? error.message });
  }
}

async function obtenerProtocolo(req, res, service) {
  try {
    const { id } = req.params;
    const protocolo = await service.obtener(id);
    logger.info('Protocolo obtenido con ID: %d', protocolo.protocolo_id);
    res.status(200).json(JSON.stringify(protocolo));
  } catch (error) {
    logger.error('Error al obtener protocolo: %o', error);
    res.status(500).json({ error: error.message });
  }
}

async function agregarCiclo(req, res, service) {
  try {
    const protocoloId = Number(req.params.id);
    const payload = Array.isArray(req.body) ? req.body : [req.body];
    const errors = [];

    const ciclos = payload.map((c) => {
      if (!c.ciclo_id || !c.regimen || !c.duracion_semanas || c.ciclo_final === undefined || !c.repeticiones) {
        errors.push('validation_error');
        return;
      }
      const ciclo = new Ciclo(
        Number(c.ciclo_id),
        protocoloId,
        Number(c.regimen),
        Number(c.duracion_semanas),
        Boolean(c.ciclo_final === true || c.ciclo_final === 'true' || c.ciclo_final === 1 || c.ciclo_final === '1'),
        Number(c.repeticiones)
      );
      return ciclo;
    });

    if (errors.length > 0) {
      return res.status(400).json({ error: ERROR_CAMPOS_REQUERIDOS });
    }

    const protocolo = await service.agregarCiclos(protocoloId, ciclos);
    logger.info('Ciclo agregado al protocolo ID: %d', protocoloId);
    res.status(200).json(protocolo);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error.message });
  }
}

async function agregarAdministracion(req, res, protocoloService, drogaService) {
  try {
    const protocoloId = Number(req.params.id);
    const cicloId = Number(req.params.id_ciclo);
    const regimen = Number(req.params.id_regimen);

    const payload = Array.isArray(req.body) ? req.body : [req.body];

    const administracion_medicaciones = await protocoloService.validarAdministraciones(payload, drogaService);

    const protocolo = await protocoloService.obtener(protocoloId);
    const ciclo = protocolo.validarCicloEnRegimen(cicloId, regimen);

    const protocoloConAdmin = await protocoloService.agregarAdministracion(
      protocolo,
      ciclo,
      administracion_medicaciones,
    );

    logger.info('Administración agregada al ciclo ID: %d del protocolo ID: %d', cicloId, protocoloId);
    res.status(201).json(protocoloConAdmin);
  }

  catch (error) {
    logger.error('Error al agregar administración: %o', error);
    res.status(error.status || 500).json({ error: error.message, message: error.details ?? error.message });
  }
}
