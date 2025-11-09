import oracledb from 'oracledb';
import Paciente from '../domain/paciente.js';
import { ERROR_PACIENTE_CREACION, ERROR_PACIENTE_NO_ENCONTRADO } from '../errors/paciente.js';
import { RepositorioPacienteProfesional } from './repositorioPacienteProfesional.js';
import { toFloat, toStr } from '../utils/formatters.js';

export class RepositorioPaciente {
  constructor(connection) {
    this.connection = connection;
    this.pacienteProfesionalRepo = new RepositorioPacienteProfesional(connection);
  }

  async guardar(paciente) {

    const result = await this.connection.execute(
      `INSERT INTO paciente (
            nombre, apellido, id_hospitalario, fecha_nacimiento, peso, altura, sup_corporal, sexo, ultima_modificacion, obra_social, dni
          ) VALUES (
            :nombre, :apellido, :id_hospitalario, :fecha_nacimiento, :peso, :altura, :sup_corporal, :sexo, SYSDATE, :obra_social, :dni
          )
          RETURNING paciente_id INTO :id`,
      {
        nombre: toStr(paciente.nombre),
        apellido: toStr(paciente.apellido),
        id_hospitalario: toStr(paciente.id_hospitalario),
        fecha_nacimiento: paciente.fecha_nacimiento,
        peso: toFloat(paciente.peso),
        altura: Number(paciente.altura),
        sup_corporal: toFloat(paciente.sup_corporal),
        sexo: toStr(paciente.sexo),
        obra_social: toStr(paciente.obra_social),
        dni: toStr(paciente.dni),
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
      `SELECT paciente_id, nombre, apellido, id_hospitalario, fecha_nacimiento, peso, altura, sexo, ultima_modificacion, obra_social, dni, sup_corporal
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
      row.ALTURA,
      row.SEXO,
      row.OBRA_SOCIAL,
      row.DNI,
      row.SUP_CORPORAL,
      row.ULTIMA_MODIFICACION,
      row.PACIENTE_ID,
    );
  }

  async obtenerTodos() {
    const result = await this.connection.execute(
      `SELECT paciente_id, nombre, apellido, id_hospitalario, fecha_nacimiento, peso, altura, sexo, ultima_modificacion, obra_social, dni, sup_corporal
           FROM paciente`,
    );

    const pacientes = [];
    for (const row of result.rows) {
      pacientes.push(new Paciente(
        row.NOMBRE,
        row.APELLIDO,
        row.ID_HOSPITALARIO,
        row.FECHA_NACIMIENTO ? new Date(row.FECHA_NACIMIENTO).toISOString().split('T')[0] : null,
        row.PESO,
        row.ALTURA,
        row.SEXO,
        row.OBRA_SOCIAL,
        row.DNI,
        row.SUP_CORPORAL,
        row.ULTIMA_MODIFICACION,
        row.PACIENTE_ID,
      ));
    }

    return pacientes;
  }

  async actualizarParcialmente(id, campos) {
    const keys = Object.keys(campos);

    if (keys.length === 0) {
      return id;
    }

    // 1. Preparar la cláusula SET y los bind variables
    const setStatements = [];
    const bindParams = {};

    const formattedFields = {
      peso: toFloat(campos.peso),
      altura: Number(campos.altura),
      obra_social: toStr(campos.obra_social),
      sup_corporal: toFloat(campos.sup_corporal)
    };

    // 2. Construir la cláusula SET con bind variables de Oracle (:campo)
    for (const key of keys) {
      // Ignorar claves que no existen o son null/undefined en el objeto formateado si no se deben actualizar
      if (formattedFields[key] !== undefined) {
        setStatements.push(`${key} = :${key}`);
        bindParams[key] = formattedFields[key];
      }
    }

    // Agregar el campo de auditoría: siempre se actualiza
    setStatements.push('ultima_modificacion = SYSDATE');

    const setClause = setStatements.join(', ');

    // 3. Agregar el ID y el autoCommit para la ejecución
    bindParams.id = id;

    const sql = `
        UPDATE paciente
        SET ${setClause}
        WHERE paciente_id = :id
    `;

    const result = await this.connection.execute(
      sql,
      bindParams,
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      // Si no actualizó nada, probablemente el ID no existe
      throw new Error(ERROR_PACIENTE_NO_ENCONTRADO);
    }

    return id;
  }
}
