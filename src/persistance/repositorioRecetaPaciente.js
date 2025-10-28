import oracledb from 'oracledb';
import { ERROR_RECETA_PACIENTE_CREACION, ERROR_RECETA_PACIENTE_CREACION_CODE } from '../errors/receta.js';
import { FK_NOT_EXISTENT_CODE } from '../errors/index.js';
import { toFloat, toNum, toStr } from '../utils/formatters.js';
import { mapRecetaPacienteInsertError } from './errorsMapper.js';
import RecetaPaciente from '../domain/receta/recetaPaciente.js';


export class RepositorioRecetaPaciente {
  constructor(connection) {
    this.connection = connection;
  }

  async guardar(rp) {
    try {
      const identidad = rp.paciente_snapshot.identidad;
      const domicilio = rp.paciente_snapshot.domicilio;
      const contacto = rp.paciente_snapshot.contacto;
      const clinica = rp.datos_paciente;
      const contexto = rp.contexto;

      const result = await this.connection.execute(
        `INSERT INTO receta_paciente (
          fecha_prescripcion, nombre, apellido, tipo_documento, numero_documento,
          fecha_nacimiento, sexo, nacionalidad,
          domicilio_calle, domicilio_numero, domicilio_piso, domicilio_depto,
          codigo_postal, localidad, partido,
          telefono, email,
          peso, talla, superficie_corporal, diagnostico, numero_ciclo,
          protocolo_id, ciclo_id, regimen, paciente_id, profesional_id, estado
        ) VALUES (
          SYSDATE, :nombre, :apellido, :tipo_documento, :numero_documento,
          :fecha_nacimiento, :sexo, :nacionalidad,
          :domicilio_calle, :domicilio_numero, :domicilio_piso, :domicilio_depto,
          :codigo_postal, :localidad, :partido,
          :telefono, :email,
          :peso, :talla, :superficie_corporal, :diagnostico, :numero_ciclo,
          :protocolo_id, :ciclo_id, :regimen, :paciente_id, :profesional_id, :estado
        )
        RETURNING receta_id, fecha_prescripcion INTO :id, :fecha_prescripcion`,
        {
          nombre: toStr(identidad.nombre),
          apellido: toStr(identidad.apellido),
          tipo_documento: toStr(identidad.tipoDocumento),
          numero_documento: toStr(identidad.numeroDocumento),
          fecha_nacimiento: identidad.fechaNacimiento ? new Date(identidad.fechaNacimiento) : null,
          sexo: toStr(identidad.sexo),
          nacionalidad: toStr(identidad.nacionalidad),
          domicilio_calle: toStr(domicilio.calle),
          domicilio_numero: toStr(domicilio.numero),
          domicilio_piso: toStr(domicilio.piso),
          domicilio_depto: toStr(domicilio.depto),
          codigo_postal: toStr(domicilio.codigoPostal),
          localidad: toStr(domicilio.localidad),
          partido: toStr(domicilio.partido),
          telefono: toStr(contacto.telefono),
          email: toStr(contacto.email),
          peso: toFloat(clinica.peso),
          talla: toFloat(clinica.talla),
          superficie_corporal: toFloat(clinica.superficieCorporal),
          diagnostico: toStr(rp.diagnostico),
          numero_ciclo: toNum(contexto.numeroCiclo),
          protocolo_id: toNum(contexto.protocolo_id),
          ciclo_id: toNum(contexto.ciclo_id),
          regimen: toNum(contexto.regimen),
          paciente_id: toNum(rp.paciente_id),
          profesional_id: toNum(rp.profesional_id),
          estado: toStr(rp.estado),
          id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
          fecha_prescripcion: { dir: oracledb.BIND_OUT, type: oracledb.DATE },
        },
        { autoCommit: true }
      );

      if (result.rowsAffected === 0) {
        throw new Error(ERROR_RECETA_PACIENTE_CREACION);
      }

      rp.id = result.outBinds.id[0];
      rp.fecha_prescripcion = new Date(result.outBinds.fecha_prescripcion[0]);

      return rp;

    } catch (err) {
      if (err.errorNum === FK_NOT_EXISTENT_CODE) {
        const mappedError = mapRecetaPacienteInsertError(err);
        throw mappedError;
      }

      throw {
        status: 500,
        code: ERROR_RECETA_PACIENTE_CREACION_CODE,
        message: ERROR_RECETA_PACIENTE_CREACION
      };
    }
  }

  async obtener(id) {
    const result = await this.connection.execute(
      `SELECT protocolo_id, ciclo_id, regimen, paciente_id,
              profesional_id, fecha_receta, estado,
              peso, talla, superficie_corporal, receta_id
       FROM receta_paciente
       WHERE receta_id = :id`,
      [id],
    );

    if (!result || !result.rows) {
      console.error('Error: La consulta no devolvió un resultado válido.');
      return null;
    }

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return new RecetaPaciente(
      row.PROTOCOLO_ID, row.CICLO_ID, row.REGIMEN, row.PACIENTE_ID, row.PROFESIONAL_ID,
      row.ESTADO, row.PESO, row.TALLA, row.SUPERFICIE_CORPORAL, row.FECHA_RECETA, row.RECETA_ID
    );
  }

}
