import Droga from '../domain/droga/index.js';
import logger from '../utils/logger.js';

export const makeDrogaController = (drogaService) => ({
  crear: (req, res) => crearDroga(req, res, drogaService),
});

async function crearDroga(req, res, service) {
  try {
    const { medicamento, presentacion, dosis, dosis_unidad, dosis_maxima, dosis_maxima_unidad } = req.body;
    if (!medicamento || !presentacion || !dosis || !dosis_unidad || !dosis_maxima || !dosis_maxima_unidad) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    const droga = new Droga(medicamento, presentacion, dosis, dosis_unidad, dosis_maxima, dosis_maxima_unidad);
    await service.crear(droga);
    logger.info('Droga creada con ID: %d', droga.id_droga);
    res.status(201).json(droga);
  } catch (error) {
    console.error('Error al crear la droga:', error);
    res.status(500).json({ error: 'Error al crear la droga' });
  }
}
