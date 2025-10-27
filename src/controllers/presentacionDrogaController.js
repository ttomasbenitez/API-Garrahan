import PresentacionDroga from '../domain/droga/presentacionDroga.js';
import { ERROR_PRESENTACION_DROGA_CREACION, ERROR_PRESENTACION_DROGA_NO_ENCONTRADA, ERROR_ID_PRESENTACION_DROGA_INVALIDO, ERROR_PRESENTACION_DROGA_ELIMINACION } from '../errors/presentacionDroga.js';
import logger from '../utils/logger.js';

export const makePresentacionDrogaController = (service) => ({
  crear: (req, res) => crearPresentacion(req, res, service),
  obtener: (req, res) => obtenerPresentacion(req, res, service),
  listar: (req, res) => listarPresentaciones(req, res, service),
  eliminar: (req, res) => eliminarPresentacion(req, res, service),
});

async function crearPresentacion(req, res, service) {
  try {
    const droga_id = parseInt(req.params.droga_id, 10);
    const payload = Array.isArray(req.body) ? req.body : [req.body];
    const faltantes = payload.filter(p => !p.forma_farmaceutica_id || !p.codigo_farmacia);
    if (faltantes.length > 0) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    const presentaciones = payload.map(p => new PresentacionDroga(
      droga_id,
      p.forma_farmaceutica_id,
      p.codigo_farmacia,
      p.estado,
      p.fuerza_valor,
      p.fuerza_unidad
    ));
    await service.crear(presentaciones);
    logger.info('Presentaciones de droga creadas con IDs: %o', presentaciones.map(p => p.presentacion_id).join(', '));
    res.status(201).json(presentaciones);
  } catch (error) {
    logger.error('Error al crear la presentacion de droga: %o', error);
    res.status(500).json({ error: ERROR_PRESENTACION_DROGA_CREACION });
  }
}

async function obtenerPresentacion(req, res, service) {
  try {
    const id = parseInt(req.params.presentacion_id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: ERROR_ID_PRESENTACION_DROGA_INVALIDO });
    }
    const presentacion = await service.obtener(id);
    if (!presentacion) {
      return res.status(404).json({ error: ERROR_PRESENTACION_DROGA_NO_ENCONTRADA });
    }
    res.status(200).json(presentacion);
  } catch (error) {
    logger.error('Error al obtener la presentacion de droga: %o', error);
    res.status(500).json({ error: ERROR_PRESENTACION_DROGA_NO_ENCONTRADA });
  }
}

async function listarPresentaciones(req, res, service) {
  try {
    const droga_id = req.params.droga_id;
    const presentaciones = await service.listar(droga_id);
    res.status(200).json(presentaciones);
  } catch (error) {
    logger.error('Error al listar presentaciones de droga: %o', error);
    res.status(500).json({ error: 'Error al listar presentaciones de droga' });
  }
}

async function eliminarPresentacion(req, res, service) {
  try {
    const id = parseInt(req.params.presentacion_id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: ERROR_ID_PRESENTACION_DROGA_INVALIDO });
    }
    await service.eliminar(id);
    res.status(200).json({ eliminado: true, id });
  } catch (error) {
    logger.error('Error al eliminar presentacion de droga: %o', error);
    res.status(500).json({ error: ERROR_PRESENTACION_DROGA_ELIMINACION });
  }
}
