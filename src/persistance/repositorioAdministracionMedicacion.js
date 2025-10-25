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
           cantidad_dias, administracion_diaria, frecuencia_diaria)
        VALUES
          (:protocolo_id, :ciclo_id, :regimen,
           :droga_id, :via_id,
           :fuerza_valor, :fuerza_unidad,
           :cantidad_dias, :administracion_diaria, :frecuencia_diaria)
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
          administracion_diaria: toNum(a.administracion_diaria),
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
            administracion_diaria: { type: oracledb.NUMBER },
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
}
