import OracleDB from 'oracledb';
import { ERROR_PRESENTACION_DROGA_VIA_CREACION, ERROR_PRESENTACION_DROGA_VIA_ELIMINACION } from '../errors/presentacionDrogaVia.js';
import PresentacionDrogaVia from '../domain/droga/presentacionDrogaVia.js';
import { toNum } from '../utils/formatters.js';

export class RepositorioPresentacionDrogaVia {
  constructor(db) {
    this.db = db;
  }

  async guardar(presentacionesVia) {
    try {
      const result = await this.db.withConnection(async (conn) => {
        const sql = `
          INSERT INTO presentacion_droga_via (via_id, presentacion_id, es_default)
          VALUES (:via_id, :presentacion_id, :es_default)
        `;

        const binds = presentacionesVia.map(pv => ({
          via_id: toNum(pv.via_id),
          presentacion_id: toNum(pv.presentacion_id),
          es_default: pv.es_default || '0',
        }));

        const opts = {
          autoCommit: true,
          bindDefs: {
            via_id: { type: OracleDB.NUMBER },
            presentacion_id: { type: OracleDB.NUMBER },
            es_default: { type: OracleDB.STRING, maxSize: 1 },
          }
        };

        return await conn.executeMany(sql, binds, opts);
      });

      if (result.rowsAffected === 0) {
        throw new Error(ERROR_PRESENTACION_DROGA_VIA_CREACION);
      }

      return true;
    } catch (error) {
      console.error('Error en RepositorioPresentacionDrogaVia.guardar:', error);
      throw error;
    }
  }

  async obtener(via_id, presentacion_id) {
    try {
      const result = await this.db.execute(
        'SELECT via_id, presentacion_id, es_default FROM presentacion_droga_via WHERE via_id = :via_id AND presentacion_id = :presentacion_id',
        [via_id, presentacion_id]
      );

      if (!result.rows || result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return new PresentacionDrogaVia(row.VIA_ID, row.PRESENTACION_ID, row.ES_DEFAULT);
    } catch (error) {
      console.error('Error en RepositorioPresentacionDrogaVia.obtener:', error);
      throw error;
    }
  }

  async listarPorPresentacion(presentacion_id) {
    try {
      const result = await this.db.execute(
        `SELECT pdv.via_id, pdv.presentacion_id, pdv.es_default, va.nombre as via_nombre
         FROM presentacion_droga_via pdv
         JOIN via_administracion va ON pdv.via_id = va.via_id
         WHERE pdv.presentacion_id = :presentacion_id`,
        [presentacion_id]
      );

      return result.rows.map(row => ({
        via_id: row.VIA_ID,
        presentacion_id: row.PRESENTACION_ID,
        es_default: row.ES_DEFAULT,
        via_nombre: row.VIA_NOMBRE,
      }));
    } catch (error) {
      console.error('Error en RepositorioPresentacionDrogaVia.listarPorPresentacion:', error);
      throw error;
    }
  }

  async eliminar(via_id, presentacion_id) {
    try {
      const result = await this.db.execute(
        'DELETE FROM presentacion_droga_via WHERE via_id = :via_id AND presentacion_id = :presentacion_id',
        [via_id, presentacion_id]
      );

      if (result.rowsAffected === 0) {
        throw new Error(ERROR_PRESENTACION_DROGA_VIA_ELIMINACION);
      }

      return true;
    } catch (error) {
      console.error('Error en RepositorioPresentacionDrogaVia.eliminar:', error);
      throw error;
    }
  }
}
