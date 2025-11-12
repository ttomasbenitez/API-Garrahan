import oracledb from 'oracledb';
import Profesional from '../domain/profesional.js';
import { ERROR_DNI_NO_ENCONTRADO_CODE, ERROR_PROFESIONAL_CREACION, ERROR_PROFESIONAL_NO_ENCONTRADO } from '../errors/profesional.js';
import { getError, toNum, toStr } from '../utils/formatters.js';

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
        nombre: toStr(profesional.nombre),
        apellido: toStr(profesional.apellido),
        dni: toNum(profesional.dni),
        matricula: toStr(profesional.matricula),
        especialidad: toStr(profesional.especialidad),
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

  async obtenerTodos() {
    const result = await this.connection.execute(
      `SELECT profesional_id, nombre, apellido, dni, matricula, especialidad
           FROM profesional`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    return result.rows.map(row => new Profesional(
      row.NOMBRE,
      row.APELLIDO,
      row.DNI,
      row.MATRICULA,
      row.ESPECIALIDAD,
      row.PROFESIONAL_ID
    ));
  }

  async obtenerPorDni(dni) {
    const result = await this.connection.execute(
      `SELECT profesional_id, nombre, apellido, dni, matricula, especialidad
           FROM profesional
           WHERE dni = :dni`,
      [dni],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0) {
      throw getError(ERROR_PROFESIONAL_NO_ENCONTRADO, ERROR_DNI_NO_ENCONTRADO_CODE);
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
