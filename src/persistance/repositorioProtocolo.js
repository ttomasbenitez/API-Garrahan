import oracledb from 'oracledb';
import Protocolo from '../domain/protocolo/index.js';
import { ERROR_PROTOCOLO_CREACION, ERROR_PROTOCOLO_NO_ENCONTRADO } from '../errors/protocolo.js';
import Ciclo from '../domain/protocolo/ciclo.js';
import { toStr } from '../utils/formatters.js';
export class RepositorioProtocolo {
  constructor(db) {
    this.db = db;
  }

  async guardar(protocolo) {
    return await this.db.withConnection(async (conn) => {
      const result = await conn.execute(
        `INSERT INTO protocolo (nombre, enfermedad, linea, cantidad_regimenes)
         VALUES (:nombre, :enfermedad, :linea, :cantidad_regimenes)
         RETURNING protocolo_id INTO :id`,
        {
          nombre: toStr(protocolo.nombre),
          enfermedad: toStr(protocolo.enfermedad),
          linea: toStr(protocolo.linea),
          cantidad_regimenes: Number(protocolo.cantidad_regimenes),
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
      `SELECT protocolo_id, nombre, enfermedad, linea, cantidad_regimenes FROM protocolo 
      WHERE protocolo_id = :id`,
      [id]
    );

    if (result.rows.length === 0) throw new Error(ERROR_PROTOCOLO_NO_ENCONTRADO);

    const ciclos = await this.obtenerCiclos(id);
    const row = result.rows[0];
    return new Protocolo(row.NOMBRE, row.ENFERMEDAD, row.LINEA, row.CANTIDAD_REGIMENES,
      row.PROTOCOLO_ID, ciclos);
  }

  async obtenerTodos() {
    const result = await this.db.execute(
      'SELECT protocolo_id, nombre, enfermedad, linea, cantidad_regimenes FROM protocolo'
    );

    const protocolos = [];
    for (const row of result.rows) {
      const ciclos = await this.obtenerCiclos(row.PROTOCOLO_ID);
      protocolos.push(new Protocolo(row.NOMBRE, row.ENFERMEDAD, row.LINEA, row.CANTIDAD_REGIMENES,
        row.PROTOCOLO_ID, ciclos));
    }

    return protocolos;
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
}
