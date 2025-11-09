import oracledb from 'oracledb';
import { ERROR_ADMINISTRACION_MEDICACION_CREACION } from '../errors/administracionMedicacion.js';
import { toNum, toStr } from '../utils/formatters.js';

export class RepositorioAdminisitracionMedicacion {
  constructor(db) { this.db = db; }

  async guardar(administraciones) {
    try {
      const result = await this.db.withConnection(async (conn) => {
        const sql = `
        INSERT INTO administracion_medicacion
          (protocolo_id, ciclo_id, regimen,
           droga_id, via_id,
           fuerza_valor, fuerza_unidad,
           cantidad_dias, frecuencia_diaria)
        VALUES
          (:protocolo_id, :ciclo_id, :regimen,
           :droga_id, :via_id,
           :fuerza_valor, :fuerza_unidad,
           :cantidad_dias, :frecuencia_diaria)
        RETURNING admin_id INTO :id
      `;

        const binds = administraciones.map(a => ({
          protocolo_id: toNum(a.protocolo_id),
          ciclo_id: toNum(a.ciclo_id),
          regimen: toNum(a.regimen),
          droga_id: toNum(a.droga_id),
          via_id: toNum(a.via_id),
          fuerza_valor: toNum(a.fuerza_valor),
          fuerza_unidad: toStr(a.fuerza_unidad),
          cantidad_dias: toNum(a.cantidad_dias),
          frecuencia_diaria: toNum(a.frecuencia_diaria)
        }));

        const opts = {
          autoCommit: true,
          bindDefs: {
            protocolo_id: { type: oracledb.NUMBER },
            ciclo_id: { type: oracledb.NUMBER },
            regimen: { type: oracledb.NUMBER },
            droga_id: { type: oracledb.NUMBER },
            via_id: { type: oracledb.NUMBER },
            fuerza_valor: { type: oracledb.NUMBER },
            fuerza_unidad: { type: oracledb.STRING, maxSize: 20 },
            cantidad_dias: { type: oracledb.NUMBER },
            frecuencia_diaria: { type: oracledb.NUMBER },
            id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
          }
        };
        return await conn.executeMany(sql, binds, opts);
      });

      if (result.rowsAffected === 0) {
        throw new Error(ERROR_ADMINISTRACION_MEDICACION_CREACION);
      }
      return result.outBinds.map(bind => bind.id[0]);
    } catch (error) {
      console.error('Error en RepositorioDroga.guardar:', error);
      throw error;
    }
  }
  async getById(admin_id) {
    const sql = `
      SELECT a.*, v.codigo AS via_codigo
      FROM administracion_medicacion a
      INNER JOIN via_administracion v ON a.via_id = v.via_id
      WHERE a.admin_id = :admin_id
    `;
    const result = await this.db.withConnection(conn => conn.execute(sql, { admin_id: Number(admin_id) }, { outFormat: oracledb.OUT_FORMAT_OBJECT }));
    if (!result.rows || result.rows.length === 0) return null;
    return result.rows[0];
  }
}
