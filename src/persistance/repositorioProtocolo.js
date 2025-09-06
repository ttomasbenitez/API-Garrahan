import oracledb from 'oracledb';
import Protocolo from '../domain/protocolo/index.js';
import { ERROR_PROTOCOLO_CREACION, ERROR_PROTOCOLO_NO_ENCONTRADO } from '../errors/protocolo.js';

export class RepositorioProtocolo {
  constructor(connection) {
    this.connection = connection;
  }

  async guardar(protocolo) {
    const result = await this.connection.execute(
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
  }

  async obtener(id) {
    const result = await this.connection.execute(
      'SELECT protocolo_id, nombre, enfermedad, linea FROM protocolo WHERE protocolo_id = :id',
      [id]
    );
    if (result.rows.length === 0) {
      throw new Error(ERROR_PROTOCOLO_NO_ENCONTRADO);
    }
    return Protocolo.fromRow(result.rows[0]);
  }
}
