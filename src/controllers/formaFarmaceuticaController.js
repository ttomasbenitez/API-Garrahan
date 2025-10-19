import FormaFarmaceutica from '../domain/droga/formaFarmaceutica.js';
import { ERROR_FORMA_FARMACEUTICA_NO_ENCONTRADA, ERROR_FORMA_FARMACEUTICA_CREACION, ERROR_ID_FORMA_FARMACEUTICA_INVALIDO, ERROR_OBTENER_FORMA_FARMACEUTICA, ERROR_FORMA_FARMACEUTICA_ELIMINACION, ERROR_FORMA_FARMACEUTICA_CON_PRESENTACIONES } from '../errors/formaFarmaceutica.js';
import logger from '../utils/logger.js';

export const makeFormaFarmaceuticaController = (formaFarmaceuticaService) => ({
  crear: (req, res) => crearFormaFarmaceutica(req, res, formaFarmaceuticaService),
  obtener: (req, res) => obtenerFormaFarmaceutica(req, res, formaFarmaceuticaService),
  listar: (req, res) => listarFormaFarmaceutica(req, res, formaFarmaceuticaService),
  actualizar: (req, res) => actualizarFormaFarmaceutica(req, res, formaFarmaceuticaService),
  eliminar: (req, res) => eliminarFormaFarmaceutica(req, res, formaFarmaceuticaService),
});

async function crearFormaFarmaceutica(req, res, service) {
  try {
    const payload = Array.isArray(req.body) ? req.body : [req.body];

    const faltantes = payload.filter(f =>
      !f.nombre ||
      !f.codigo
    );
    if (faltantes.length > 0) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const formas = payload.map(f => new FormaFarmaceutica(
      f.nombre,
      f.codigo,
    ));

    await service.crear(formas);
    logger.info('Formas farmacéuticas creadas con IDs: %o', formas.map(f => f.forma_farmaceutica_id).join(', '));
    res.status(201).json(formas);
  } catch (error) {
    logger.error('Error al crear la forma farmacéutica: %o', error);
    res.status(500).json({ error: ERROR_FORMA_FARMACEUTICA_CREACION });
  }
}

async function obtenerFormaFarmaceutica(req, res, service) {
  try {
    const idForma = parseInt(req.params.id, 10);
    if (isNaN(idForma)) {
      return res.status(400).json({ error: ERROR_ID_FORMA_FARMACEUTICA_INVALIDO });
    }
    const forma = await service.obtener(idForma);
    if (!forma) {
      return res.status(404).json({ error: ERROR_FORMA_FARMACEUTICA_NO_ENCONTRADA });
    }
    res.status(200).json(forma);
  } catch (error) {
    logger.error('Error al obtener la forma farmacéutica: %o', error);
    return res.status(500).json({ error: ERROR_OBTENER_FORMA_FARMACEUTICA });
  }
}

async function listarFormaFarmaceutica(_req, res, service) {
  try {
    const formas = await service.listar();
    res.status(200).json(formas);
  } catch (error) {
    logger.error('Error al listar formas farmacéuticas: %o', error);
    res.status(500).json({ error: 'Error al listar formas farmacéuticas' });
  }
}

async function actualizarFormaFarmaceutica(req, res, service) {
  try {
    const idForma = parseInt(req.params.id, 10);
    if (isNaN(idForma)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    const { nombre, codigo } = req.body;
    if (!nombre || !codigo) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    const actualizado = await service.actualizar(idForma, { nombre, codigo });
    if (!actualizado) {
      return res.status(404).json({ error: 'Forma farmacéutica no encontrada' });
    }
    res.status(200).json({ id: idForma, nombre, codigo });
  } catch (error) {
    logger.error('Error al actualizar forma farmacéutica: %o', error);
    res.status(500).json({ error: 'Error al actualizar forma farmacéutica' });
  }
}

async function eliminarFormaFarmaceutica(req, res, service) {
  try {
    const idForma = parseInt(req.params.id, 10);
    if (isNaN(idForma)) {
      return res.status(400).json({ error: ERROR_ID_FORMA_FARMACEUTICA_INVALIDO });
    }
    await service.eliminar(idForma);
    res.status(200).json({ eliminado: true, id: idForma });
  } catch (error) {
    logger.error('Error al eliminar forma farmacéutica: %o', error);
    if (error.message.includes('presentaciones de droga asociadas')) {
      return res.status(409).json({ error: ERROR_FORMA_FARMACEUTICA_CON_PRESENTACIONES });
    }
    if (error.message.includes('no encontrada')) {
      return res.status(404).json({ error: ERROR_FORMA_FARMACEUTICA_NO_ENCONTRADA });
    }
    res.status(500).json({ error: ERROR_FORMA_FARMACEUTICA_ELIMINACION });
  }
}
