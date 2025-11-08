import oracledb from 'oracledb';
import { ERROR_RECETA_DETALLE_CREACION, ERROR_RECETA_DETALLE_CREACION_CODE, ERROR_RECETA_PACIENTE_CREACION, ERROR_RECETA_PACIENTE_CREACION_CODE } from '../errors/receta.js';
import { FK_NOT_EXISTENT_CODE, UNIQUE_VIOLATION_CODE } from '../errors/index.js';
import { toFloat, toNum, toStr } from '../utils/formatters.js';
import { mapRecetaDetalleInsertError, mapRecetaPacienteInsertError } from './errorsMapper.js';
import RecetaPaciente from '../domain/receta/recetaPaciente.js';
import { Contacto, ContextoSnapshot, DatosPaciente, Domicilio, Identidad, PacienteSnapshot } from '../domain/receta/pacienteSnapshot.js';
import { RecetaDetalle } from '../domain/receta/recetaDetalle.js';


export class RepositorioRecetaPaciente {
  constructor(connection) {
    this.connection = connection;
  }

  async guardar(rp) {
    return await this.connection.withConnection(async (conn) => {
      try {
        const identidad = rp.paciente_snapshot.identidad;
        const domicilio = rp.paciente_snapshot.domicilio;
        const contacto  = rp.paciente_snapshot.contacto;
        const datos_paciente   = rp.datos_paciente;
        const contexto  = rp.contexto;

        const result = await conn.execute(
          `INSERT INTO receta_paciente (
            fecha_prescripcion, nombre, apellido, tipo_documento, numero_documento,
            fecha_nacimiento, sexo, nacionalidad,
            domicilio_calle, domicilio_numero, domicilio_piso, domicilio_depto,
            codigo_postal, localidad, partido,
            telefono, email,
            peso, talla, superficie_corporal, diagnostico, numero_ciclo,
            protocolo_id, ciclo_id, regimen, paciente_id, profesional_id, estado
          ) VALUES (
            NVL(:fecha_prescripcion, SYSDATE), :nombre, :apellido, :tipo_documento, :numero_documento,
            :fecha_nacimiento, :sexo, :nacionalidad,
            :domicilio_calle, :domicilio_numero, :domicilio_piso, :domicilio_depto,
            :codigo_postal, :localidad, :partido,
            :telefono, :email,
            :peso, :talla, :superficie_corporal, :diagnostico, :numero_ciclo,
            :protocolo_id, :ciclo_id, :regimen, :paciente_id, :profesional_id, :estado
          )
          RETURNING receta_id, fecha_prescripcion INTO :id, :fecha_prescripcion_out`,
          {
            fecha_prescripcion: rp.fecha_prescripcion ? new Date(rp.fecha_prescripcion) : null,
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
            peso: toFloat(datos_paciente.peso),
            talla: toFloat(datos_paciente.talla),
            superficie_corporal: toFloat(datos_paciente.superficie_corporal),
            diagnostico: toStr(rp.diagnostico),
            numero_ciclo: toNum(contexto.numero_ciclo),
            protocolo_id: toNum(contexto.protocolo_id),
            ciclo_id: toNum(contexto.ciclo_id),
            regimen: toNum(contexto.regimen),
            paciente_id: toNum(rp.paciente_id),
            profesional_id: toNum(rp.profesional_id),
            estado: toStr(rp.estado),
            id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
            fecha_prescripcion_out: { dir: oracledb.BIND_OUT, type: oracledb.DATE },
          },
          { autoCommit: false }
        );

        if (result.rowsAffected === 0) {
          throw { status: 500, code: ERROR_RECETA_PACIENTE_CREACION_CODE, message: ERROR_RECETA_PACIENTE_CREACION };
        }

        rp.id = result.outBinds.id[0];
        rp.fecha_prescripcion = new Date(result.outBinds.fecha_prescripcion_out[0]);


        if (Array.isArray(rp.detalles) && rp.detalles.length > 0) {
          const detalleSql = `
            INSERT INTO receta_detalle (
              receta_id, admin_id, nombre_generico, presentacion, concentracion,
              cantidad, dosis_diaria, numero_dias, dosis_total, via_administracion
            ) VALUES (
              :receta_id, :admin_id, :nombre_generico, :presentacion, :concentracion,
              :cantidad, :dosis_diaria, :numero_dias, :dosis_total, :via_administracion
            )
          `;

          rp.detalles = rp.detalles.map(d => {
            d.receta_id = rp.id;
            return d;
          });

          const binds = rp.detalles.map(d => ({
            receta_id: toNum(rp.id),
            admin_id: toNum(d.admin_id),
            nombre_generico: toStr(d.nombre_generico),
            presentacion: toStr(d.presentacion),
            concentracion: toStr(d.concentracion),
            cantidad: toNum(d.cantidad),
            dosis_diaria: toNum(d.dosis_diaria),
            numero_dias: toNum(d.numero_dias),
            dosis_total: toNum(d.dosis_total),
            via_administracion: toStr(d.via_administracion),
          }));

          const detalleOpts = {
            autoCommit: false,
            bindDefs: {
              receta_id:        { type: oracledb.NUMBER },
              admin_id:         { type: oracledb.NUMBER },
              nombre_generico:  { type: oracledb.STRING, maxSize: 100 },
              presentacion:     { type: oracledb.STRING, maxSize: 100 },
              concentracion:    { type: oracledb.STRING, maxSize: 50 },
              cantidad:         { type: oracledb.NUMBER },
              dosis_diaria:     { type: oracledb.NUMBER },
              numero_dias:      { type: oracledb.NUMBER },
              dosis_total:      { type: oracledb.NUMBER },
              via_administracion: { type: oracledb.STRING, maxSize: 100 },
            }
          };

          const detRes = await conn.executeMany(detalleSql, binds, detalleOpts);

          if (!detRes.rowsAffected || detRes.rowsAffected < rp.detalles.length) {
            throw { status: 500, code: ERROR_RECETA_DETALLE_CREACION_CODE, message: ERROR_RECETA_DETALLE_CREACION };
          }
        }

        await conn.commit();
        return rp.id;

      } catch (err) {
        try {
          await conn.rollback();
        } catch (_) {
          console.error('Error during rollback', _);
        }

        if (err?.errorNum === FK_NOT_EXISTENT_CODE || err?.errorNum === UNIQUE_VIOLATION_CODE) {
          const mapped =
            err.sql?.includes('RECETA_DETALLE') || (err.message && err.message.toUpperCase().includes('RECETA_DETALLE'))
              ? mapRecetaDetalleInsertError(err)
              : mapRecetaPacienteInsertError(err);
          throw mapped;
        }

        throw {
          status: 500,
          code: ERROR_RECETA_PACIENTE_CREACION_CODE,
          message: ERROR_RECETA_PACIENTE_CREACION,
          original: err
        };
      }
    });
  }


  async obtenerDetalles(recetaId) {
    const result = await this.connection.execute(
      `SELECT 
        receta_id, admin_id, nombre_generico, presentacion, concentracion,
        cantidad, dosis_diaria, numero_dias, dosis_total, via_administracion
      FROM receta_detalle
      WHERE receta_id = :receta_id`,
      [recetaId],
      { outFormat: this.connection.OUT_FORMAT_OBJECT }    );


    return result.rows.map(row => {
      const ciclo = new RecetaDetalle({
        admin_id: toNum(row.ADMIN_ID),
        nombre_generico: toStr(row.NOMBRE_GENERICO),
        presentacion: toStr(row.PRESENTACION),
        concentracion: toStr(row.CONCENTRACION),
        cantidad: toNum(row.CANTIDAD),
        dosis_diaria: toNum(row.DOSIS_DIARIA),
        numero_dias: toNum(row.NUMERO_DIAS),
        dosis_total: toNum(row.DOSIS_TOTAL),
        via_administracion: toStr(row.VIA_ADMINISTRACION),
        receta_id: toNum(row.RECETA_ID),
      });
      return ciclo;
    });
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

    const paciente_snapshot = new PacienteSnapshot({
      identidad,
      domicilio,
      contacto,
    });

    const datos_paciente = new DatosPaciente({
      peso: toFloat(row.PESO),
      talla: toFloat(row.TALLA),
      superficie_corporal: toFloat(row.SUPERFICIE_CORPORAL),
    });

    const contexto = new ContextoSnapshot({
      protocolo_id: toNum(row.PROTOCOLO_ID),
      ciclo_id: toNum(row.CICLO_ID),
      regimen: toNum(row.REGIMEN),
      numero_ciclo: toNum(row.NUMERO_CICLO),
    });

    const detalles = await this.obtenerDetalles(id);

    const receta = new RecetaPaciente({
      paciente_snapshot,
      datos_paciente,
      diagnostico: toStr(row.DIAGNOSTICO),
      contexto,
      paciente_id: toNum(row.PACIENTE_ID),
      profesional_id: toNum(row.PROFESIONAL_ID),
      estado: toStr(row.ESTADO),
      detalles,
    });

    receta.id = toNum(row.RECETA_ID);
    receta.fecha_prescripcion = row.FECHA_PRESCRIPCION ? new Date(row.FECHA_PRESCRIPCION) : null;

    return receta;
  }

  async obtenerTodasPorIdPaciente(idPaciente) {
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
       WHERE paciente_id = :idPaciente`,
      [idPaciente],
      { outFormat: this.connection.OUT_FORMAT_OBJECT }
    );

    if (!result?.rows || result.rows.length === 0) {
      return null;
    }

    const recetas = await Promise.all(
      result.rows.map(async (row) => {
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

        const paciente_snapshot = new PacienteSnapshot({
          identidad,
          domicilio,
          contacto,
        });

        const datos_paciente = new DatosPaciente({
          peso: toFloat(row.PESO),
          talla: toFloat(row.TALLA),
          superficie_corporal: toFloat(row.SUPERFICIE_CORPORAL),
        });

        const contexto = new ContextoSnapshot({
          protocolo_id: toNum(row.PROTOCOLO_ID),
          ciclo_id: toNum(row.CICLO_ID),
          regimen: toNum(row.REGIMEN),
          numero_ciclo: toNum(row.NUMERO_CICLO),
        });

        const detalles = await this.obtenerDetalles(row.RECETA_ID);

        const receta = new RecetaPaciente({
          paciente_snapshot,
          datos_paciente,
          diagnostico: toStr(row.DIAGNOSTICO),
          contexto,
          paciente_id: toNum(row.PACIENTE_ID),
          profesional_id: toNum(row.PROFESIONAL_ID),
          estado: toStr(row.ESTADO),
          detalles,
        });

        receta.id = toNum(row.RECETA_ID);
        receta.fecha_prescripcion = row.FECHA_PRESCRIPCION ? new Date(row.FECHA_PRESCRIPCION) : null;

        return receta;
      })
    );

    return recetas;
  }
}
