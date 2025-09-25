import oracledb from 'oracledb';
import { ERROR_DROGRA_CREACION } from '../errors/droga.js';
import Droga from '../domain/droga/index.js';

export class RepositorioDroga {
  constructor(db) {
    this.db = db;
  }

  async guardar(drogas) {
    try {
      const result = await this.db.withConnection(async (conn) => {
        const sql = `
        INSERT INTO droga (nombre_generico, codigo_farmacia)
        VALUES (:nombre_generico, :codigo_farmacia)
        RETURNING droga_id INTO :id
      `;
        const toStr = (v) => (v === undefined || v === null ? null : String(v));

        const binds = drogas.map(d => ({
          nombre_generico: toStr(d.nombre_generico),
          codigo_farmacia: toStr(d.codigo_farmacia),
        }));

        const opts = {
          autoCommit: true,
          bindDefs: {
            nombre_generico: { type: oracledb.STRING, maxSize: 100 },
            codigo_farmacia: { type: oracledb.STRING, maxSize: 100 },
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
      'SELECT nombre_generico, codigo_farmacia, droga_id FROM droga WHERE droga_id = :id',
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return new Droga(...result.rows[0]);
  }
}
