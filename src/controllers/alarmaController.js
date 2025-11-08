import logger from '../utils/logger.js';

export const makeAlarmaController = (alarmaService) => ({
  listar: (req, res) => listarAlarmas(req, res, alarmaService),
  listarPorProfesional: (req, res) => listarAlarmasPorProfesional(req, res, alarmaService),
  generarManual: (req, res) => generarAlarmasManual(req, res, alarmaService),
});

async function listarAlarmas(req, res, service) {
  try {
    const alarmas = await service.listar();
    logger.info('Listado de alarmas obtenido: %d alarmas', alarmas.length);
    res.status(200).json(alarmas);
  } catch (error) {
    logger.error('Error al listar alarmas: %o', error);
    res.status(500).json({ error: 'Error al obtener las alarmas' });
  }
}

async function listarAlarmasPorProfesional(req, res, service) {
  try {
    const profesionalId = req.user.id;

    if (!profesionalId || isNaN(Number(profesionalId))) {
      logger.warn('ID de profesional inválido: %s', profesionalId);
      return res.status(400).json({ error: 'ID de profesional inválido' });
    }

    const alarmas = await service.listarPorProfesional(Number(profesionalId));
    logger.info('Listado de alarmas por profesional %d: %d alarmas', profesionalId, alarmas.length);
    res.status(200).json(alarmas);
  } catch (error) {
    logger.error('Error al listar alarmas por profesional: %o', error);
    res.status(500).json({ error: 'Error al obtener las alarmas del profesional' });
  }
}

async function generarAlarmasManual(req, res, service) {
  try {
    logger.info('Generación manual de alarmas solicitada por usuario: %s', req.user?.name || 'desconocido');
    const resultado = await service.generarAlarmas();
    logger.info('Generación manual de alarmas completada: %o', resultado);
    res.status(200).json({
      mensaje: 'Alarmas generadas exitosamente',
      ...resultado
    });
  } catch (error) {
    logger.error('Error al generar alarmas manualmente: %o', error);
    res.status(500).json({ error: 'Error al generar las alarmas' });
  }
}
