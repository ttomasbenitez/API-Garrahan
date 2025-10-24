import oracledb from 'oracledb';
import Protocolo from '../domain/protocolo/index.js';
import { ERROR_PROTOCOLO_CREACION, ERROR_PROTOCOLO_NO_ENCONTRADO } from '../errors/protocolo.js';
import Ciclo from '../domain/protocolo/ciclo.js';
export class RepositorioProtocolo {
  constructor(db) {
    this.db = db;
  }

  async guardar(protocolo) {
    return await this.db.withConnection(async (conn) => {
      const result = await conn.execute(
        `INSERT INTO protocolo (nombre, enfermedad, linea)
         VALUES (:nombre, :enfermedad, :linea)
         RETURNING protocolo_id INTO :id`,
        {
          nombre: protocolo.nombre,
          enfermedad: protocolo.enfermedad,
          linea: protocolo.linea,
          id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
        },
        { autoCommit: true }
      );

      if (result.rowsAffected === 0) throw new Error(ERROR_PROTOCOLO_CREACION);

      return result.outBinds.id[0];
    });
  }

  async obtenerCiclos(protocoloId) {
    const result = await this.db.execute(
      'SELECT ciclo_id, protocolo_id, regimen, duracion_semanas, ciclo_final, repeticiones FROM ciclo WHERE protocolo_id = :protocoloId',
      [protocoloId]
    );

    return result.rows.map(row => {
      const ciclo = new Ciclo(row.CICLO_ID, row.PROTOCOLO_ID, row.REGIMEN, row.DURACION_SEMANAS, row.CICLO_FINAL === 1, row.REPETICIONES);
      return ciclo;
    });
  }

  async obtener(id) {
    const result = await this.db.execute(
      'SELECT protocolo_id, nombre, enfermedad, linea FROM protocolo WHERE protocolo_id = :id',
      [id]
    );

    if (result.rows.length === 0) throw new Error(ERROR_PROTOCOLO_NO_ENCONTRADO);

    const ciclos = await this.obtenerCiclos(id);
    const row = result.rows[0];
    return new Protocolo(row.NOMBRE, row.ENFERMEDAD, row.LINEA, row.PROTOCOLO_ID, ciclos);
  }

  async agregarCiclo(protocoloId, ciclos) {
    try {
      const result = await this.db.withConnection(async (conn) => {
        const sql =
          `INSERT INTO ciclo (protocolo_id, ciclo_id, regimen, duracion_semanas, ciclo_final, repeticiones)
           VALUES (:protocolo_id, :ciclo_id, :regimen, :duracion_semanas, :ciclo_final, :repeticiones)`;

        const binds = ciclos.map(ciclo => ({
          protocolo_id: protocoloId,
          ciclo_id: ciclo.ciclo_id,
          regimen: ciclo.regimen,
          duracion_semanas: ciclo.duracion_semanas,
          ciclo_final: ciclo.ciclo_final ? 1 : 0,
          repeticiones: ciclo.repeticiones,
        }));

        const opts = {
          autoCommit: true,
          bindDefs: {
            protocolo_id: { type: oracledb.NUMBER },
            ciclo_id: { type: oracledb.NUMBER },
            regimen: { type: oracledb.NUMBER },
            duracion_semanas: { type: oracledb.NUMBER },
            ciclo_final: { type: oracledb.NUMBER },
            repeticiones: { type: oracledb.NUMBER },
          }
        };

        return await conn.executeMany(sql, binds, opts);
      });

      if (result.rowsAffected === 0) throw new Error('Error al agregar ciclos al protocolo');

      return ciclos;
    } catch(err) {
      console.error(err);
      throw new Error('Error al agregar ciclos al protocolo');
    }
  }

  async agregarAdministracion(protocolo, ciclo, administracion_medicaciones) {
    try {
      const result = await this.db.withConnection(async (conn) => {
        const sql = `
          INSERT INTO administracion_medicacion 
          (protocolo_id, ciclo_id, regimen, droga_id, dosis, dosis_unidad, frecuencia, administracion_diaria, frecuencia_diaria)
          VALUES (:protocolo_id, :ciclo_id, :regimen, :droga_id, :dosis, :dosis_unidad, :frecuencia, :administracion_diaria, :frecuencia_diaria)
          RETURNING id INTO :id
        `;

        const toNum = v => (v === null || v === '' ? null : Number(v));
        const toStr = v => (v === null ? null : String(v));

        const binds = administracion_medicaciones.map(a => ({
          protocolo_id: toNum(protocolo.protocolo_id),
          ciclo_id: toNum(ciclo.ciclo_id),
          regimen: toNum(ciclo.regimen),
          droga_id: toNum(a.droga_id),
          dosis: toNum(a.dosis),
          dosis_unidad: toStr(a.dosis_unidad),
          frecuencia: toStr(a.frecuencia),
          administracion_diaria: toNum(a.administracion_diaria),
          frecuencia_diaria: toNum(a.frecuencia_diaria),
        }));

        const opts = {
          autoCommit: true,
          bindDefs: {
            protocolo_id: { type: oracledb.NUMBER },
            ciclo_id: { type: oracledb.NUMBER },
            regimen: { type: oracledb.NUMBER },
            droga_id: { type: oracledb.NUMBER },
            dosis: { type: oracledb.NUMBER },
            dosis_unidad: { type: oracledb.STRING, maxSize: 20 },
            frecuencia: { type: oracledb.STRING, maxSize: 100 },
            administracion_diaria: { type: oracledb.NUMBER },
            frecuencia_diaria: { type: oracledb.NUMBER },
            id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
          }
        };

        return await conn.executeMany(sql, binds, opts);
      });

      if (result.rowsAffected === 0) throw new Error('Error al agregar administraciones de medicación');

      return result.outBinds.map(bind => bind.id[0]);

    } catch (error) {
      console.error('Error en RepositorioProtocolo.agregarAdministracion:', error);
      throw error;
    }
  }
}
