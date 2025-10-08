import ViaAdministracion from '../domain/droga/viaAdministracion.js';
import { ERROR_CAMPOS_REQUERIDOS } from '../errors/index.js';
import { ERROR_OBTENER_VIA_ADMINISTRACION, ERROR_VIA_ADMINISTRACION_CREACION, ERROR_VIA_ADMINISTRACION_ID, ERROR_VIA_ADMINISTRACION_NO_ENCONTRADA } from '../errors/viaAdministracion.js';
import logger from '../utils/logger.js';

export const makeViaAdministracionController = (viaAdministracionService) => ({
  crear: (req, res) => crearViaAdministraicon(req, res, viaAdministracionService),
  obtener: (req, res) => obtenerViaAdministracion(req, res, viaAdministracionService)
});

async function crearViaAdministraicon(req, res, service) {
  try {
    const payload = Array.isArray(req.body) ? req.body : [req.body];

    const faltantes = payload.filter(d =>
      !d.nombre ||
      !d.codigo
    );
    if (faltantes.length > 0) {
      return res.status(400).json({ error: ERROR_CAMPOS_REQUERIDOS });
    }

    const viasAdministracion = payload.map(d => new ViaAdministracion(
      d.nombre,
      d.codigo,
    ));

    await service.crear(viasAdministracion);
    logger.info('Vias de administracion creadas con IDs: %o', viasAdministracion.map(d => d.via_id).join(', '));
    res.status(201).json(viasAdministracion);
  } catch (error) {
    logger.error('Error al crear las administraciones: %o', error);
    res.status(500).json({ error: ERROR_VIA_ADMINISTRACION_CREACION });
  }
}

async function obtenerViaAdministracion(req, res, service) {
  try {
    const idViaAdministracion = parseInt(req.params.id, 10);
    if (isNaN(idViaAdministracion)) {
      return res.status(400).json({ error: ERROR_VIA_ADMINISTRACION_ID });
    }
    const viaAdministracion = await service.obtener(idViaAdministracion);
    if (!viaAdministracion) {
      return res.status(404).json({ error: ERROR_VIA_ADMINISTRACION_NO_ENCONTRADA });
    }
    res.status(200).json(viaAdministracion);
  } catch (error) {
    logger.error('Error al obtener la via de administracion: %o', error);
    return res.status(500).json({ error: ERROR_OBTENER_VIA_ADMINISTRACION });
  }
}

