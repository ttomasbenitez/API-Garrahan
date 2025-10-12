import oracledb from 'oracledb';
import { ERROR_VIA_ADMINISTRACION_CREACION } from '../errors/viaAdministracion.js';
import ViaAdministracion from '../domain/droga/viaAdministracion.js';

export class RepositorioViaAdministracion {
  constructor(db) {
    this.db = db;
  }

  async guardar(viasAdministracion) {
    try {
      const result = await this.db.withConnection(async (conn) => {
        const sql = `
        INSERT INTO via_administracion (nombre, codigo)
        VALUES (:nombre, :codigo)
        RETURNING via_id INTO :id
      `;
        const toStr = (v) => (v === undefined || v === null ? null : String(v));

        const binds = viasAdministracion.map(d => ({
          nombre: toStr(d.nombre),
          codigo: toStr(d.codigo),
        }));

        const opts = {
          autoCommit: true,
          bindDefs: {
            nombre: { type: oracledb.STRING, maxSize: 100 },
            codigo: { type: oracledb.STRING, maxSize: 50 },
            id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
          }
        };
        return await conn.executeMany(sql, binds, opts);
      });

      if (result.rowsAffected === 0) {
        throw new Error(ERROR_VIA_ADMINISTRACION_CREACION);
      }
      return result.outBinds.map(bind => bind.id[0]);
    } catch (error) {
      console.error('Error en RepositorioViaAdministracion.guardar:', error);
    }
  }

  async obtener(id) {
    const result = await this.db.execute(
      'SELECT nombre, codigo, via_id FROM via_administracion WHERE via_id = :id',
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return new ViaAdministracion(row.NOMBRE, row.CODIGO, row.VIA_ID);
  }
}
