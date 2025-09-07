import Protocolo from '../domain/protocolo/index.js';
import logger from '../utils/logger.js';

export const makeProtocoloController = (protocoloService) => ({
  crear: (req, res) => crearProtocolo(req, res, protocoloService),
  obtener: (req, res) => obtenerProtocolo(req, res, protocoloService),
  agregarCiclo: (req, res) => agregarCiclo(req, res, protocoloService),
});


async function crearProtocolo(req, res, service) {
  try {
    const { nombre, enfermedad, linea } = req.body;
    if (!nombre || !enfermedad || !linea) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    const protocolo = new Protocolo(nombre, enfermedad, linea, null);
    await service.crear(protocolo);
    logger.info('Protocolo creado con ID: %d', protocolo.protocolo_id);
    res.status(201).json(protocolo);
  } catch (error) {
    logger.error('Error al crear protocolo: %o', error);
    res.status(500).json({ error: error.message });
  }
}

async function obtenerProtocolo(req, res, service) {
  try {
    const { id } = req.params;
    const protocolo = await service.obtener(id);
    logger.info('Protocolo obtenido con ID: %d', protocolo.protocolo_id);
    res.status(200).json(JSON.stringify(protocolo));
  } catch (error) {
    logger.error('Error al obtener protocolo: %o', error);
    res.status(500).json({ error: error.message });
  }
}

async function agregarCiclo(req, res, service) {
  try {
    const { id } = req.params;
    const { ciclo_id, regimen, duracion_semanas, ciclo_final } = req.body;
    if (!ciclo_id || !regimen || !duracion_semanas || ciclo_final === undefined) {
      return res.status(400).json({ error: 'Faltan campos requeridos para el ciclo' });
    }
    const protocolo = await service.agregarCiclo(id, { id: ciclo_id, regimen, duracion_semanas, ciclo_final });
    logger.info('Ciclo agregado al protocolo ID: %d', id);
    res.status(200).json(protocolo);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error.message });
  }
}
