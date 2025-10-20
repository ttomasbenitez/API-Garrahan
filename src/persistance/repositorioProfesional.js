import oracledb from 'oracledb';
import Profesional from '../domain/profesional.js';
import { ERROR_PROFESIONAL_CREACION, ERROR_PROFESIONAL_NO_ENCONTRADO } from '../errors/profesional.js';

export class RepositorioProfesional {
  constructor(connection) {
    this.connection = connection;
  }

  async guardar(profesional) {

    const result = await this.connection.execute(
      `INSERT INTO profesional (
            nombre, apellido, dni, matricula, especialidad
          ) VALUES (
            :nombre, :apellido, :dni, :matricula, :especialidad
          )
          RETURNING profesional_id INTO :id`,
      {
        nombre: profesional.nombre,
        apellido: profesional.apellido,
        dni: profesional.dni,
        matricula: profesional.matricula,
        especialidad: profesional.especialidad,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      throw new Error(ERROR_PROFESIONAL_CREACION);
    }

    return result.outBinds.id[0];

  }

  async obtener(id) {
    const result = await this.connection.execute(
      `SELECT profesional_id, nombre, apellido, dni, matricula, especialidad
           FROM profesional
           WHERE profesional_id = :id`,
      [id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0) {
      throw new Error(ERROR_PROFESIONAL_NO_ENCONTRADO);
    }

    const row = result.rows[0];
    return new Profesional(
      row.NOMBRE,
      row.APELLIDO,
      row.DNI,
      row.MATRICULA,
      row.ESPECIALIDAD,
      row.PROFESIONAL_ID
    );
  }
}
