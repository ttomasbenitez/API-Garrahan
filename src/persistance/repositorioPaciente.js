import oracledb from 'oracledb';
import Paciente from '../domain/paciente.js';
import { ERROR_PACIENTE_CREACION, ERROR_PACIENTE_NO_ENCONTRADO } from '../errors/paciente.js';

export class RepositorioPaciente {
  constructor(connection) {
    this.connection = connection;
  }

  async guardar(paciente) {
    const result = await this.connection.execute(
      `INSERT INTO paciente (
            nombre, apellido, id_hospitalario, fecha_nacimiento, peso, sexo, profesional_id, ultima_modificacion, obra_social
          ) VALUES (
            :nombre, :apellido, :id_hospitalario, :fecha_nacimiento, :peso, :sexo, :profesional_id, :ultima_modificacion, :obra_social
          )
          RETURNING id INTO :id`,
      {
        nombre: paciente.nombre,
        apellido: paciente.apellido,
        id_hospitalario: paciente.id_hospitalario,
        fecha_nacimiento: paciente.fecha_nacimiento,
        peso: paciente.peso,
        sexo: paciente.sexo,
        profesional_id: paciente.profesional_id,
        ultima_modificacion: paciente.ultima_modificacion,
        obra_social: paciente.obra_social,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      throw new Error(ERROR_PACIENTE_CREACION);
    }

    return result.outBinds.id[0];
  }

  async obtener(id) {
    const result = await this.connection.execute(
      `SELECT id, nombre, apellido, id_hospitalario, fecha_nacimiento, peso, sexo, profesional_id, ultima_modificacion, obra_social
           FROM paciente
           WHERE id = :id`,
      [id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0) {
      throw new Error(ERROR_PACIENTE_NO_ENCONTRADO);
    }

    const row = result.rows[0];
    return new Paciente(
      row.NOMBRE,
      row.APELLIDO,
      row.ID_HOSPITALARIO,
      row.FECHA_NACIMIENTO ? new Date(row.FECHA_NACIMIENTO).toISOString().split('T')[0] : null,
      row.PESO,
      row.SEXO,
      row.PROFESIONAL_ID,
      row.ID,
      row.ULTIMA_MODIFICACION,
      row.OBRA_SOCIAL
    );
  }
}
