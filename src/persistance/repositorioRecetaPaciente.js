import oracledb from 'oracledb';
import { ERROR_RECETA_PACIENTE_CREACION, ERROR_RECETA_PACIENTE_CREACION_CODE } from '../errors/receta.js';
import { FK_NOT_EXISTENT_CODE } from '../errors/index.js';
import { toFloat, toNum, toStr } from '../utils/formatters.js';
import { mapRecetaPacienteInsertError } from './errorsMapper.js';
import RecetaPaciente from '../domain/receta/recetaPaciente.js';
import { Contacto, ContextoSnapshot, DatosPaciente, Domicilio, Identidad, PacienteSnapshot } from '../domain/receta/pacienteSnapshot.js';


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
          tipo_documento: toStr(identidad.tipo_documento),
          numero_documento: toStr(identidad.numero_documento),
          fecha_nacimiento: identidad.fecha_nacimiento ? new Date(identidad.fecha_nacimiento) : null,
          sexo: toStr(identidad.sexo),
          nacionalidad: toStr(identidad.nacionalidad),
          domicilio_calle: toStr(domicilio.calle),
          domicilio_numero: toStr(domicilio.numero),
          domicilio_piso: toStr(domicilio.piso),
          domicilio_depto: toStr(domicilio.depto),
          codigo_postal: toStr(domicilio.codigo_postal),
          localidad: toStr(domicilio.localidad),
          partido: toStr(domicilio.partido),
          telefono: toStr(contacto.telefono),
          email: toStr(contacto.email),
          peso: toFloat(clinica.peso),
          talla: toFloat(clinica.talla),
          superficie_corporal: toFloat(clinica.superficie_corporal),
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
      `SELECT
          receta_id,
          fecha_prescripcion,
          nombre, apellido, tipo_documento, numero_documento,
          fecha_nacimiento, sexo, nacionalidad,
          domicilio_calle, domicilio_numero, domicilio_piso,
          domicilio_depto, codigo_postal, localidad, partido,
          telefono, email,
          peso, talla, superficie_corporal,
          diagnostico, numero_ciclo,
          protocolo_id, ciclo_id, regimen,
          paciente_id, profesional_id, estado
       FROM receta_paciente
       WHERE receta_id = :id`,
      [id],
      { outFormat: this.connection.OUT_FORMAT_OBJECT }
    );

    if (!result?.rows || result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];

    // --- reconstruir snapshots y objetos internos ---
    const identidad = new Identidad({
      nombre: toStr(row.NOMBRE),
      apellido: toStr(row.APELLIDO),
      tipo_documento: toStr(row.TIPO_DOCUMENTO),
      numero_documento: toStr(row.NUMERO_DOCUMENTO),
      fecha_nacimiento: row.FECHA_NACIMIENTO ? new Date(row.FECHA_NACIMIENTO) : null,
      sexo: toStr(row.SEXO),
      nacionalidad: toStr(row.NACIONALIDAD),
    });

    const domicilio = new Domicilio({
      calle: toStr(row.DOMICILIO_CALLE),
      numero: toStr(row.DOMICILIO_NUMERO),
      piso: toStr(row.DOMICILIO_PISO),
      depto: toStr(row.DOMICILIO_DEPTO),
      codigo_postal: toStr(row.CODIGO_POSTAL),
      localidad: toStr(row.LOCALIDAD),
      partido: toStr(row.PARTIDO),
    });

    const contacto = new Contacto({
      telefono: toStr(row.TELEFONO),
      email: toStr(row.EMAIL),
    });

    const pacienteSnapshot = new PacienteSnapshot({
      identidad,
      domicilio,
      contacto,
    });

    const datosPaciente = new DatosPaciente({
      peso: toFloat(row.PESO),
      talla: toFloat(row.TALLA),
      superficie_corporal: toFloat(row.SUPERFICIE_CORPORAL),
    });

    const contexto = new ContextoSnapshot({
      protocolo_id: toNum(row.PROTOCOLO_ID),
      ciclo_id: toNum(row.CICLO_ID),
      regimen: toNum(row.REGIMEN),
      numeroCiclo: toNum(row.NUMERO_CICLO),
    });

    const receta = new RecetaPaciente({
      paciente_snapshot: pacienteSnapshot,
      datos_paciente: datosPaciente,
      diagnostico: toStr(row.DIAGNOSTICO),
      contexto,
      paciente_id: toNum(row.PACIENTE_ID),
      profesional_id: toNum(row.PROFESIONAL_ID),
      estado: toStr(row.ESTADO),
      detalles: [],
    });

    receta.id = toNum(row.RECETA_ID);
    receta.fecha_prescripcion = row.FECHA_PRESCRIPCION ? new Date(row.FECHA_PRESCRIPCION) : null;

    return receta;
  }

}
