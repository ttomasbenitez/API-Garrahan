import OracleDB from 'oracledb';
import { ERROR_FORMA_FARMACEUTICA_CREACION } from '../errors/formaFarmaceutica.js';
import FormaFarmaceutica from '../domain/droga/formaFarmaceutica.js';

export class RepositorioFormaFarmaceutica {
  constructor(db) {
    this.db = db;
  }

  async guardar(formasFarmaceuticas) {
    try {
      const result = await this.db.withConnection(async (conn) => {
        const sql = `
        INSERT INTO forma_farmaceutica (nombre, codigo)
        VALUES (:nombre, :codigo)
        RETURNING forma_farmaceutica_id INTO :id
      `;
        const toStr = (v) => (v === undefined || v === null ? null : String(v));

        const binds = formasFarmaceuticas.map(f => ({
          nombre: toStr(f.nombre),
          codigo: toStr(f.codigo),
        }));

        const opts = {
          autoCommit: true,
          bindDefs: {
            nombre: { type: OracleDB.STRING, maxSize: 100 },
            codigo: { type: OracleDB.STRING, maxSize: 100 },
            id: { type: OracleDB.NUMBER, dir: OracleDB.BIND_OUT }
          }
        };
        return await conn.executeMany(sql, binds, opts);
      });

      if (result.rowsAffected === 0) {
        throw new Error(ERROR_FORMA_FARMACEUTICA_CREACION);
      }
      return result.outBinds.map(bind => bind.id[0]);
    } catch (error) {
      console.error('Error en RepositorioFormaFarmaceutica.guardar:', error);
      throw error;
    }
  }

  async obtener(id) {
    try {
      const result = await this.db.execute(
        'SELECT nombre, codigo, forma_farmaceutica_id FROM forma_farmaceutica WHERE forma_farmaceutica_id = :id',
        [id]
      );

      if (!result.rows || result.rows.length === 0) {
        return null;
      }
      const row = result.rows[0];
      return new FormaFarmaceutica(row.NOMBRE, row.CODIGO, row.FORMA_FARMACEUTICA_ID);
    } catch (error) {
      console.error('Error en RepositorioFormaFarmaceutica.obtener:', error);
      throw error;
    }
  }

  async listar() {
    try {
      const result = await this.db.execute(
        'SELECT nombre, codigo, forma_farmaceutica_id FROM forma_farmaceutica',
        []
      );
      return result.rows.map(row => new FormaFarmaceutica(row.NOMBRE, row.CODIGO, row.FORMA_FARMACEUTICA_ID));
    } catch (error) {
      console.error('Error en RepositorioFormaFarmaceutica.listar:', error);
      throw error;
    }}

  async actualizar(id, datos) {
    const result = await this.db.execute(
      'UPDATE forma_farmaceutica SET nombre = :nombre, codigo = :codigo WHERE forma_farmaceutica_id = :id',
      [datos.nombre, datos.codigo, id]
    );
    return result.rowsAffected > 0;
  }
}
