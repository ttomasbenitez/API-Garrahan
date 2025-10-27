import OracleDB from 'oracledb';
import { ERROR_PRESENTACION_DROGA_CREACION, ERROR_PRESENTACION_DROGA_ELIMINACION } from '../errors/presentacionDroga.js';
import PresentacionDroga from '../domain/droga/presentacionDroga.js';
import { toNum, toStr } from '../utils/formatters.js';

export class RepositorioPresentacionDroga {
  constructor(db) {
    this.db = db;
  }

  async guardar(presentaciones) {
    try {
      const result = await this.db.withConnection(async (conn) => {
        const sql = `
        INSERT INTO presentacion_droga (droga_id, forma_farmaceutica_id, codigo_farmacia, estado, fuerza_valor, fuerza_unidad)
        VALUES (:droga_id, :forma_farmaceutica_id, :codigo_farmacia, :estado, :fuerza_valor, :fuerza_unidad)
        RETURNING presentacion_id INTO :id
      `;
        const binds = presentaciones.map(p => ({
          droga_id: toNum(p.droga_id),
          forma_farmaceutica_id: toNum(p.forma_farmaceutica_id),
          codigo_farmacia: toStr(p.codigo_farmacia),
          estado: toStr(p.estado),
          fuerza_valor: toNum(p.fuerza_valor),
          fuerza_unidad: toStr(p.fuerza_unidad),
        }));

        const opts = {
          autoCommit: true,
          bindDefs: {
            droga_id: { type: OracleDB.NUMBER },
            forma_farmaceutica_id: { type: OracleDB.NUMBER },
            codigo_farmacia: { type: OracleDB.STRING, maxSize: 50 },
            estado: { type: OracleDB.STRING, maxSize: 50 },
            fuerza_valor: { type: OracleDB.NUMBER },
            fuerza_unidad: { type: OracleDB.STRING, maxSize: 20 },
            id: { type: OracleDB.NUMBER, dir: OracleDB.BIND_OUT }
          }
        };
        return await conn.executeMany(sql, binds, opts);
      });
      if (result.rowsAffected === 0) {
        throw new Error(ERROR_PRESENTACION_DROGA_CREACION);
      }
      return result.outBinds.map(bind => bind.id[0]);
    } catch (error) {
      console.error('Error en RepositorioPresentacionDroga.guardar:', error);
      throw error;
    }
  }

  async obtener(id) {
    try {
      const result = await this.db.execute(
        'SELECT droga_id, forma_farmaceutica_id, codigo_farmacia, estado, fuerza_valor, fuerza_unidad, presentacion_id FROM presentacion_droga WHERE presentacion_id = :id',
        [id]
      );
      if (!result.rows || result.rows.length === 0) {
        return null;
      }
      const row = result.rows[0];
      return new PresentacionDroga(row.DROGA_ID, row.FORMA_FARMACEUTICA_ID, row.CODIGO_FARMACIA, row.ESTADO, row.FUERZA_VALOR, row.FUERZA_UNIDAD, row.PRESENTACION_ID);
    } catch (error) {
      console.error('Error en RepositorioPresentacionDroga.obtener:', error);
      throw error;
    }
  }

  async listar(droga_id) {
    try {
      const result = await this.db.execute(
        `SELECT droga_id, forma_farmaceutica_id, estado, fuerza_valor, fuerza_unidad, 
          presentacion_id FROM presentacion_droga WHERE droga_id = :droga_id`,
        {droga_id}
      );
      return result.rows.map(row => new PresentacionDroga(row.DROGA_ID, row.FORMA_FARMACEUTICA_ID, row.CODIGO_FARMACIA, row.ESTADO, row.FUERZA_VALOR, row.FUERZA_UNIDAD, row.PRESENTACION_ID));
    } catch (error) {
      console.error('Error en RepositorioPresentacionDroga.listar:', error);
      throw error;
    }
  }

  async eliminar(id) {
    try {
      const result = await this.db.execute(
        'DELETE FROM presentacion_droga WHERE presentacion_id = :id',
        [id]
      );
      if (result.rowsAffected === 0) {
        throw new Error(ERROR_PRESENTACION_DROGA_ELIMINACION);
      }
      return true;
    } catch (error) {
      console.error('Error en RepositorioPresentacionDroga.eliminar:', error);
      throw error;
    }
  }
}
