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
        nombre, apellido, id_hospitalario, fecha_nacimiento, peso, sup_corporal, altura, sexo, ultima_modificacion, obra_social,
        tipo_documento, numero_documento, nacionalidad, domicilio_calle, domicilio_numero, domicilio_piso_depto,
        codigo_postal, localidad, partido, telefono, email, diagnostico
      ) VALUES (
        :nombre, :apellido, :id_hospitalario, :fecha_nacimiento, :peso, :sup_corporal, :altura, :sexo, SYSDATE, :obra_social,
        :tipo_documento, :numero_documento, :nacionalidad, :domicilio_calle, :domicilio_numero, :domicilio_piso_depto,
        :codigo_postal, :localidad, :partido, :telefono, :email, :diagnostico
      ) RETURNING paciente_id INTO :id`,
      {
        nombre: toStr(paciente.nombre), apellido: toStr(paciente.apellido),
        id_hospitalario: toStr(paciente.id_hospitalario), fecha_nacimiento: paciente.fecha_nacimiento,
        peso: toFloat(paciente.peso), sup_corporal: toFloat(paciente.sup_corporal),
        altura: Number(paciente.altura), sexo: toStr(paciente.sexo),
        obra_social: toStr(paciente.obra_social), tipo_documento: toStr(paciente.tipo_documento),
        numero_documento: toStr(paciente.numero_documento), nacionalidad: toStr(paciente.nacionalidad),
        domicilio_calle: toStr(paciente.domicilio_calle), domicilio_numero: toStr(paciente.domicilio_numero),
        domicilio_piso_depto: toStr(paciente.domicilio_piso_depto), codigo_postal: toStr(paciente.codigo_postal),
        localidad: toStr(paciente.localidad), partido: toStr(paciente.partido),
        telefono: toStr(paciente.telefono), email: toStr(paciente.email),
        diagnostico: toStr(paciente.diagnostico),
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      },
      { autoCommit: true }
    );

    if (!result.rowsAffected) throw new Error(ERROR_PACIENTE_CREACION);
    return result.outBinds.id[0];
  }

  async obtener(id) {
    const result = await this.connection.execute(
      `SELECT paciente_id, nombre, apellido, id_hospitalario, fecha_nacimiento, peso, sup_corporal, altura,
              ultima_modificacion, sexo, obra_social, tipo_documento, numero_documento, nacionalidad,
              domicilio_calle, domicilio_numero, domicilio_piso_depto, codigo_postal, localidad, partido,
              telefono, email, diagnostico
         FROM paciente
        WHERE paciente_id = :id`,
      [id]
    );
    if (!result.rows.length) throw new Error(ERROR_PACIENTE_NO_ENCONTRADO);

    const r = result.rows[0];
    return new Paciente({
      paciente_id: r.PACIENTE_ID, nombre: r.NOMBRE, apellido: r.APELLIDO, id_hospitalario: r.ID_HOSPITALARIO,
      fecha_nacimiento: r.FECHA_NACIMIENTO ? new Date(r.FECHA_NACIMIENTO).toISOString().split('T')[0] : null,
      peso: r.PESO, sup_corporal: r.SUP_CORPORAL, altura: r.ALTURA, ultima_modificacion: r.ULTIMA_MODIFICACION,
      sexo: r.SEXO, obra_social: r.OBRA_SOCIAL, tipo_documento: r.TIPO_DOCUMENTO, numero_documento: r.NUMERO_DOCUMENTO,
      nacionalidad: r.NACIONALIDAD, domicilio_calle: r.DOMICILIO_CALLE, domicilio_numero: r.DOMICILIO_NUMERO,
      domicilio_piso_depto: r.DOMICILIO_PISO_DEPTO, codigo_postal: r.CODIGO_POSTAL, localidad: r.LOCALIDAD,
      partido: r.PARTIDO, telefono: r.TELEFONO, email: r.EMAIL, diagnostico: r.DIAGNOSTICO
    });
  }

  async obtenerTodos() {
    const result = await this.connection.execute(
      `SELECT paciente_id, nombre, apellido, id_hospitalario, fecha_nacimiento, peso, sup_corporal, altura,
              ultima_modificacion, sexo, obra_social, tipo_documento, numero_documento, nacionalidad,
              domicilio_calle, domicilio_numero, domicilio_piso_depto, codigo_postal, localidad, partido,
              telefono, email, diagnostico
         FROM paciente`
    );

    return result.rows.map(r => new Paciente({
      paciente_id: r.PACIENTE_ID, nombre: r.NOMBRE, apellido: r.APELLIDO, id_hospitalario: r.ID_HOSPITALARIO,
      fecha_nacimiento: r.FECHA_NACIMIENTO ? new Date(r.FECHA_NACIMIENTO).toISOString().split('T')[0] : null,
      peso: r.PESO, sup_corporal: r.SUP_CORPORAL, altura: r.ALTURA, ultima_modificacion: r.ULTIMA_MODIFICACION,
      sexo: r.SEXO, obra_social: r.OBRA_SOCIAL, tipo_documento: r.TIPO_DOCUMENTO, numero_documento: r.NUMERO_DOCUMENTO,
      nacionalidad: r.NACIONALIDAD, domicilio_calle: r.DOMICILIO_CALLE, domicilio_numero: r.DOMICILIO_NUMERO,
      domicilio_piso_depto: r.DOMICILIO_PISO_DEPTO, codigo_postal: r.CODIGO_POSTAL, localidad: r.LOCALIDAD,
      partido: r.PARTIDO, telefono: r.TELEFONO, email: r.EMAIL, diagnostico: r.DIAGNOSTICO
    }));
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
