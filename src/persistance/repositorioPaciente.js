import oracledb from 'oracledb';
import Paciente from '../domain/paciente.js';
import { ERROR_PACIENTE_CREACION, ERROR_PACIENTE_NO_ENCONTRADO } from '../errors/paciente.js';
import { RepositorioPacienteProfesional } from './repositorioPacienteProfesional.js';

export class RepositorioPaciente {
  constructor(connection) {
    this.connection = connection;
    this.pacienteProfesionalRepo = new RepositorioPacienteProfesional(connection);
  }

  async guardar(paciente) {

    const result = await this.connection.execute(
      `INSERT INTO paciente (
            nombre, apellido, id_hospitalario, fecha_nacimiento, peso, sexo, ultima_modificacion, obra_social
          ) VALUES (
            :nombre, :apellido, :id_hospitalario, :fecha_nacimiento, :peso, :sexo, SYSDATE, :obra_social
          )
          RETURNING paciente_id INTO :id`,
      {
        nombre: paciente.nombre,
        apellido: paciente.apellido,
        id_hospitalario: paciente.id_hospitalario,
        fecha_nacimiento: paciente.fecha_nacimiento,
        peso: paciente.peso,
        sexo: paciente.sexo,
        obra_social: paciente.obra_social,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      throw new Error(ERROR_PACIENTE_CREACION);
    }

    const pacienteId = result.outBinds.id[0];

    return pacienteId;
  }

  async obtener(id) {

    const result = await this.connection.execute(
      `SELECT paciente_id, nombre, apellido, id_hospitalario, fecha_nacimiento, peso, sexo, ultima_modificacion, obra_social
           FROM paciente
           WHERE paciente_id = :id`,
      [id]
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
      row.OBRA_SOCIAL,
      row.ULTIMA_MODIFICACION,
      row.PACIENTE_ID,
    );
  }
}
