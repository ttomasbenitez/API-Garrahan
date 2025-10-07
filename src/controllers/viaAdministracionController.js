import ViaAdministracion from '../domain/droga/viaAdministracion.js';
import { ERROR_CAMPOS_REQUERIDOS } from '../errors/index.js';
import { ERROR_VIA_ADMINISTRACION_CREACION } from '../errors/viaAdministracion.js';
import logger from '../utils/logger.js';

export const makeViaAdministracionController = (viaAdministracionService) => ({
  crear: (req, res) => crearViaAdministraicon(req, res, viaAdministracionService),
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
