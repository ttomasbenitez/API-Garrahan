import Protocolo from '../domain/protocolo/index.js';

export class RepositorioProtocolo {
  constructor(connection) {
    this.connection = connection;
  }

  async crearProtocolo(protocolo) {
    const result = await this.connection.execute(
      `INSERT INTO protocolo (nombre, enfermedad, linea)
         VALUES (:nombre, :enfermedad, :linea)
         RETURNING protocolo_id INTO :id`,
      { nombre: protocolo.nombre, enfermedad: protocolo.enfermedad, linea: protocolo.linea, id: { dir: require('oracledb').BIND_OUT, type: require('oracledb').NUMBER } },
      { autoCommit: true }
    );
    return result.outBinds.id[0];
  }

  async obtenerProtocolo(id) {
    const result = await this.connection.execute(
      'SELECT protocolo_id, nombre, enfermedad, linea FROM protocolo WHERE protocolo_id = :id',
      [id]
    );
    return Protocolo.fromRow(result.rows[0]);
  }
}
