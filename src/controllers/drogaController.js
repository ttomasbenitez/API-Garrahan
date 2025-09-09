import Droga from '../domain/droga/index.js';
import logger from '../utils/logger.js';

export const makeDrogaController = (drogaService) => ({
  crear: (req, res) => crearDroga(req, res, drogaService),
});

async function crearDroga(req, res, service) {
  try {
    const payload = Array.isArray(req.body) ? req.body : [req.body];
    // Validar antes de mapear
    const faltantes = payload.filter(d =>
      !d.medicamento ||
      !d.presentacion ||
      !d.dosis ||
      !d.dosis_unidad ||
      !d.dosis_maxima ||
      !d.dosis_maxima_unidad
    );
    if (faltantes.length > 0) {
      return res.status(400).json({ error: 'Faltan campos requeridos en alguna droga' });
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
    console.error('Error al crear las drogas:', error);
    res.status(500).json({ error: 'Error al crear las drogas' });
  }
}
