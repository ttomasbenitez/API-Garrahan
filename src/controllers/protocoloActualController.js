import logger from '../utils/logger.js';
import { ERROR_PROTOCOLO_ACTUAL_INEXISTENTE } from '../errors/protocoloActual.js';

export const makeProtocoloActualController = (protocoloActualService) => ({
  obtenerDatos: (req, res) => obtenerDatos(req, res, protocoloActualService),
});

async function obtenerDatos(req, res, service) {
  try {
    const { paciente_id } = req.params;
    if (!paciente_id) {
      logger.error('Error al obtener datos del protocolo actual del paciente. Faltan campos requeridos' );
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const protocolo = await service.obtenerDatos(paciente_id);
    logger.info('Datos obtenidos del protocolo actual del paciente: %d', paciente_id);
    res.status(200).json(protocolo);
  } catch (error) {
    logger.error('Error al obtener datos del protocolo actual del paciente: %o', error);
    if (error.message === ERROR_PROTOCOLO_ACTUAL_INEXISTENTE) {
      res.status(404).json({ error: error.message });
    }
    else {
      res.status(500).json({ error: error.message });
    }
  }
}
