import Droga from '../domain/droga/index.js';
import { ERROR_DROGA_NO_ENCONTRADA, ERROR_DROGRA_CREACION, ERROR_ID_DROGA_INVALIDO, ERROR_OBTENER_DROGA } from '../errors/droga.js';
import { ERROR_CAMPOS_REQUERIDOS } from '../errors/index.js';
import logger from '../utils/logger.js';

export const makeDrogaController = (drogaService) => ({
  crear: (req, res) => crearDroga(req, res, drogaService),
  obtener: (req, res) => obtenerDroga(req, res, drogaService),
});

async function crearDroga(req, res, service) {
  try {
    const payload = Array.isArray(req.body) ? req.body : [req.body];

    const faltantes = payload.filter(d =>
      !d.medicamento ||
      !d.presentacion ||
      !d.dosis ||
      !d.dosis_unidad ||
      !d.dosis_maxima ||
      !d.dosis_maxima_unidad
    );
    if (faltantes.length > 0) {
      return res.status(400).json({ error: ERROR_CAMPOS_REQUERIDOS });
    }

    const drogas = payload.map(d => new Droga(
      d.medicamento,
      d.presentacion,
      Number(d.dosis),
      d.dosis_unidad,
      Number(d.dosis_maxima),
      d.dosis_maxima_unidad
    ));

    await service.crear(drogas);
    logger.info('Drogas creadas con IDs: %o', drogas.map(d => d.id_droga).join(', '));
    res.status(201).json(drogas);
  } catch (error) {
    logger.error('Error al crear la droga: %o', error);
    res.status(500).json({ error: ERROR_DROGRA_CREACION });
  }
}

async function obtenerDroga(req, res, service) {
  try {
    const idDroga = parseInt(req.params.id, 10);
    if (isNaN(idDroga)) {
      return res.status(400).json({ error: ERROR_ID_DROGA_INVALIDO });
    }
    const droga = await service.obtener(idDroga);
    if (!droga) {
      return res.status(404).json({ error: ERROR_DROGA_NO_ENCONTRADA });
    }
    res.status(200).json(droga);
  } catch (error) {
    logger.error('Error al obtener la droga: %o', error);
    return res.status(500).json({ error: ERROR_OBTENER_DROGA });
  }
}
