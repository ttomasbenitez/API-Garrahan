import logger from '../utils/logger.js';
import { ERROR_CONFIGURACION_NO_ENCONTRADA, ERROR_CONFIGURACION_ACTUALIZACION, ERROR_LIMITE_INVALIDO } from '../errors/configuracionAlarma.js';

export const makeConfiguracionAlarmaController = (configuracionAlarmaService) => ({
  obtener: (req, res) => obtenerConfiguracion(req, res, configuracionAlarmaService),
  actualizarLimite: (req, res) => actualizarLimite(req, res, configuracionAlarmaService),
});

async function obtenerConfiguracion(req, res, service) {
  try {
    const configuracion = await service.obtener();
    res.status(200).json(configuracion);
  } catch (error) {
    logger.error('Error al obtener la configuración de alarma: %o', error);
    if (error.message.includes('no encontrada')) {
      return res.status(404).json({ error: ERROR_CONFIGURACION_NO_ENCONTRADA });
    }
    res.status(500).json({ error: 'Error al obtener la configuración' });
  }
}

async function actualizarLimite(req, res, service) {
  try {
    const { limite_dias } = req.body;

    // Validación
    if (!limite_dias || isNaN(limite_dias) || limite_dias <= 0) {
      return res.status(400).json({ error: ERROR_LIMITE_INVALIDO });
    }

    await service.actualizarLimite(parseInt(limite_dias, 10));

    // Obtener la configuración actualizada para devolverla
    const configuracion = await service.obtener();

    logger.info('Límite de días actualizado a: %d', limite_dias);
    res.status(200).json(configuracion);
  } catch (error) {
    logger.error('Error al actualizar límite de días: %o', error);
    res.status(500).json({ error: ERROR_CONFIGURACION_ACTUALIZACION });
  }
}
