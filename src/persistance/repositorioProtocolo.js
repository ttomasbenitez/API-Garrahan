import oracledb from 'oracledb';
import Protocolo from '../domain/protocolo/index.js';
import { ERROR_PROTOCOLO_CREACION, ERROR_PROTOCOLO_NO_ENCONTRADO, ERROR_PROTOCOLO_CICLO } from '../errors/protocolo.js';

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
        { nombre: protocolo.nombre, enfermedad: protocolo.enfermedad, linea: protocolo.linea, id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER } },
        { autoCommit: true }
      );
      if (result.rowsAffected === 0) {
        throw new Error(ERROR_PROTOCOLO_CREACION);
      }
      return result.outBinds.id[0];
    });
  }

  async obtener(id) {
    const result = await this.db.execute(
      'SELECT protocolo_id, nombre, enfermedad, linea FROM protocolo WHERE protocolo_id = :id',
      [id]
    );
    if (result.rows.length === 0) {
      throw new Error(ERROR_PROTOCOLO_NO_ENCONTRADO);
    }
    return Protocolo.fromRow(result.rows[0]);
  }

  async agregarCiclo(protocoloId, ciclo) {
    return await this.db.withConnection(async (conn) => {
      const result = await conn.execute(
        `INSERT INTO ciclo (protocolo_id, ciclo_id, regimen, duracion_semanas, ciclo_final)
         VALUES (:protocolo_id, :ciclo_id, :regimen, :duracion_semanas, :ciclo_final)`,
        {
          protocolo_id: protocoloId,
          ciclo_id: ciclo.id,
          regimen: ciclo.regimen,
          duracion_semanas: ciclo.duracion_semanas,
          ciclo_final: ciclo.ciclo_final ? 1 : 0
        },
        { autoCommit: true }
      );
      if (result.rowsAffected === 0) {
        throw new Error(ERROR_PROTOCOLO_CICLO);
      }

      return result.outBinds.id[0];
    });
  }
}
