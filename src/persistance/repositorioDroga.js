import oracledb from 'oracledb';
import { ERROR_DROGA_NO_ENCONTRADA, ERROR_DROGRA_CREACION } from '../errors/droga.js';
import Droga from '../domain/droga/index.js';

export class RepositorioDroga {
  constructor(db) {
    this.db = db;
  }

  async guardar(drogas) {
    try {
      const result = await this.db.withConnection(async (conn) => {
        const sql = `
        INSERT INTO droga (medicamento, presentacion, dosis, dosis_unidad, dosis_maxima, dosis_maxima_unidad)
        VALUES (:medicamento, :presentacion, :dosis, :dosis_unidad, :dosis_maxima, :dosis_maxima_unidad)
        RETURNING id_droga INTO :id
      `;
        const toNum = (v) => (v === undefined || v === null || v === '' ? null : Number(v));
        const toStr = (v) => (v === undefined || v === null ? null : String(v));

        const binds = drogas.map(d => ({
          medicamento: toStr(d.medicamento),
          presentacion: toStr(d.presentacion),
          dosis: toNum(d.dosis),
          dosis_unidad: toStr(d.dosis_unidad),
          dosis_maxima: toNum(d.dosis_maxima),
          dosis_maxima_unidad: toStr(d.dosis_maxima_unidad),
        }));

        const opts = {
          autoCommit: true,
          bindDefs: {
            medicamento: { type: oracledb.STRING, maxSize: 100 },
            presentacion: { type: oracledb.STRING, maxSize: 100 },
            dosis: { type: oracledb.NUMBER },
            dosis_unidad: { type: oracledb.STRING, maxSize: 20 },
            dosis_maxima: { type: oracledb.NUMBER },
            dosis_maxima_unidad: { type: oracledb.STRING, maxSize: 20 },
            id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
          }
        };
        return await conn.executeMany(sql, binds, opts);
      });

      if (result.rowsAffected === 0) {
        throw new Error(ERROR_DROGRA_CREACION);
      }
      return result.outBinds.map(bind => bind.id[0]);
    } catch (error) {
      console.error('Error en RepositorioDroga.guardar:', error);
      throw error;
    }
  }

  async obtener(id) {
    const result = await this.db.execute(
      'SELECT medicamento, presentacion, dosis, dosis_unidad, dosis_maxima, dosis_maxima_unidad, id_droga FROM droga WHERE id_droga = :id',
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error(ERROR_DROGA_NO_ENCONTRADA);
    }

    return new Droga(...result.rows[0]);
  }
}
