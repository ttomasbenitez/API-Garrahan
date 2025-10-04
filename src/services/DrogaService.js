import { ERROR_CAMPOS_REQUERIDOS } from '../errors/index.js';
import { ERROR_DROGA_NO_ENCONTRADA } from '../errors/droga.js';

export class DrogaService {

  constructor(drogaRepo) {
    this.drogaRepo = drogaRepo;
  }

  async crear(drogas) {

    const ids = await this.drogaRepo.guardar(drogas);

    drogas.forEach((droga, index) => {
      droga.droga_id = ids[index];
    });

    return ids;
  }

  async obtener(idDroga) {
    return await this.drogaRepo.obtener(idDroga);
  }

  async validarDroga(droga_id) {
    if (!droga_id) {
      throw new Error(ERROR_CAMPOS_REQUERIDOS);
    }
    const droga = await this.obtener(droga_id);
    if (!droga) {
      const err = new Error(ERROR_DROGA_NO_ENCONTRADA);
      err.status = 404;
      throw err;
    }
    return droga;
  }
}
