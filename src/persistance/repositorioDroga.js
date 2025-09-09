import oracledb from 'oracledb';
import { ERROR_DROGRA_CREACION } from '../errors/droga.js';

export class RepositorioDroga {
  constructor(db) {
    this.db = db;
  }

  async guardar(droga) {
    try {
      const result = await this.db.withConnection(async (conn) => {
        const sql = `
          INSERT INTO droga (medicamento, presentacion, dosis, dosis_unidad, dosis_maxima, dosis_maxima_unidad)
          VALUES (:medicamento, :presentacion, :dosis, :dosis_unidad, :dosis_maxima, :dosis_maxima_unidad)
          RETURNING id_droga INTO :id
        `;
        const binds = {
          medicamento: droga.medicamento,
          presentacion: droga.presentacion,
          dosis: droga.dosis,
          dosis_unidad: droga.dosis_unidad,
          dosis_maxima: droga.dosis_maxima,
          dosis_maxima_unidad: droga.dosis_maxima_unidad,
          id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
        };
        const opts = { autoCommit: true };
        return await conn.execute(sql, binds, opts);
      });

      if (result.rowsAffected === 0) {
        throw new Error(ERROR_DROGRA_CREACION);
      }
      return result.outBinds.id[0];
    } catch (error) {
      console.error('Error en RepositorioDroga.guardar:', error);
      throw error;
    }
  }
}
