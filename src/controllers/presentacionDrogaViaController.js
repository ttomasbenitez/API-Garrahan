import PresentacionDrogaVia from '../domain/droga/presentacionDrogaVia.js';
import {
  ERROR_PRESENTACION_DROGA_VIA_CREACION,
  ERROR_PRESENTACION_DROGA_VIA_NO_ENCONTRADA,
  ERROR_PRESENTACION_DROGA_VIA_ELIMINACION,
  ERROR_ID_VIA_INVALIDO,
  ERROR_ID_PRESENTACION_INVALIDO
} from '../errors/presentacionDrogaVia.js';
import logger from '../utils/logger.js';

export const makePresentacionDrogaViaController = (service) => ({
  crear: (req, res) => crearPresentacionDrogaVia(req, res, service),
  obtener: (req, res) => obtenerPresentacionDrogaVia(req, res, service),
  listarPorPresentacion: (req, res) => listarPorPresentacion(req, res, service),
  eliminar: (req, res) => eliminarPresentacionDrogaVia(req, res, service),
});

async function crearPresentacionDrogaVia(req, res, service) {
  try {
    const payload = Array.isArray(req.body) ? req.body : [req.body];

    const faltantes = payload.filter(pv => !pv.via_id || !pv.presentacion_id);
    if (faltantes.length > 0) {
      return res.status(400).json({ error: 'Faltan campos requeridos: via_id y presentacion_id' });
    }

    const presentacionesVia = payload.map(pv => new PresentacionDrogaVia(
      pv.via_id,
      pv.presentacion_id,
      pv.es_default
    ));

    await service.crear(presentacionesVia);
    logger.info('Presentaciones droga vía creadas: %o', presentacionesVia.length);
    res.status(201).json({ creado: true, cantidad: presentacionesVia.length });
  } catch (error) {
    logger.error('Error al crear presentación droga vía: %o', error);
    res.status(500).json({ error: ERROR_PRESENTACION_DROGA_VIA_CREACION });
  }
}

async function obtenerPresentacionDrogaVia(req, res, service) {
  try {
    const via_id = parseInt(req.params.via_id, 10);
    const presentacion_id = parseInt(req.params.presentacion_id, 10);

    if (isNaN(via_id)) {
      return res.status(400).json({ error: ERROR_ID_VIA_INVALIDO });
    }
    if (isNaN(presentacion_id)) {
      return res.status(400).json({ error: ERROR_ID_PRESENTACION_INVALIDO });
    }

    const presentacionVia = await service.obtener(via_id, presentacion_id);

    if (!presentacionVia) {
      return res.status(404).json({ error: ERROR_PRESENTACION_DROGA_VIA_NO_ENCONTRADA });
    }

    res.status(200).json(presentacionVia);
  } catch (error) {
    logger.error('Error al obtener presentación droga vía: %o', error);
    res.status(500).json({ error: 'Error al obtener presentación droga vía' });
  }
}

async function listarPorPresentacion(req, res, service) {
  try {
    const presentacion_id = parseInt(req.params.presentacion_id, 10);

    if (isNaN(presentacion_id)) {
      return res.status(400).json({ error: ERROR_ID_PRESENTACION_INVALIDO });
    }

    const vias = await service.listarPorPresentacion(presentacion_id);
    res.status(200).json(vias);
  } catch (error) {
    logger.error('Error al listar vías por presentación: %o', error);
    res.status(500).json({ error: 'Error al listar vías' });
  }
}

async function eliminarPresentacionDrogaVia(req, res, service) {
  try {
    const via_id = parseInt(req.params.via_id, 10);
    const presentacion_id = parseInt(req.params.presentacion_id, 10);

    if (isNaN(via_id)) {
      return res.status(400).json({ error: ERROR_ID_VIA_INVALIDO });
    }
    if (isNaN(presentacion_id)) {
      return res.status(400).json({ error: ERROR_ID_PRESENTACION_INVALIDO });
    }

    await service.eliminar(via_id, presentacion_id);
    res.status(200).json({ eliminado: true, via_id, presentacion_id });
  } catch (error) {
    logger.error('Error al eliminar presentación droga vía: %o', error);
    if (error.message.includes('no encontrada')) {
      return res.status(404).json({ error: ERROR_PRESENTACION_DROGA_VIA_NO_ENCONTRADA });
    }
    res.status(500).json({ error: ERROR_PRESENTACION_DROGA_VIA_ELIMINACION });
  }
}
