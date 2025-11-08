import logger from '../utils/logger.js';

export const makeAlarmaController = (alarmaService) => ({
  listar: (req, res) => listarAlarmas(req, res, alarmaService),
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
