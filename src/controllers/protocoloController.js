import Ciclo from '../domain/protocolo/ciclo.js';
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
    const protocoloId = Number(req.params.id);
    const payload = Array.isArray(req.body) ? req.body : [req.body];
    const ciclos = payload.map((c) => {
      if (!c.ciclo_id || !c.regimen || !c.duracion_semanas || c.ciclo_final === undefined || !c.repeticiones) {
        return res.status(400).json({ error: 'validation_error' });
      }
      const ciclo = new Ciclo(
        Number(c.ciclo_id),
        protocoloId,
        Number(c.regimen),
        Number(c.duracion_semanas),
        Boolean(c.ciclo_final === true || c.ciclo_final === 'true' || c.ciclo_final === 1 || c.ciclo_final === '1'),
        Number(c.repeticiones)
      );
      return ciclo;
    });

    const protocolo = await service.agregarCiclos(protocoloId, ciclos);
    logger.info('Ciclo agregado al protocolo ID: %d', protocoloId);
    res.status(200).json(protocolo);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error.message });
  }
}
