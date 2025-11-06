import oracledb from 'oracledb';
import ProtocoloPaciente from '../domain/protocoloPaciente.js';
import { ERROR_PROTOCOLO_PACIENTE_CREACION, ERROR_PROTOCOLO_PACIENTE_NO_ENCONTRADO,
  ERROR_PACIENTE_PARA_PROTOCOLO_NO_ENCONTRADO, ERROR_CICLO_PARA_PROTOCOLO_NO_ENCONTRADO } from '../errors/protocoloPaciente.js';
import { FK_NOT_EXISTENT_CODE } from '../errors/index.js';
import { toNum, toStr } from '../utils/formatters.js';


export class RepositorioProtocoloPaciente {
  constructor(connection) {
    this.connection = connection;
  }

  // Guardar un ProtocoloPaciente
  async guardar(pp) {
    try {
      const result = await this.connection.execute(
        `INSERT INTO protocolo_paciente (
            paciente_id, protocolo_id, regimen, ciclo_actual_id,
            numero_ciclo, fecha_inicio, fecha_fin, estado,
            profesional_id_asignador, fecha_asignacion, ciclo_final, 
            repeticiones_actuales, cambiar_regimen
          ) VALUES (
            :paciente_id, :protocolo_id, :regimen, :ciclo_actual_id,
            :numero_ciclo, :fecha_inicio, :fecha_fin, :estado,
            :profesional_id_asignador, :fecha_asignacion, :ciclo_final, 
            :repeticiones_actuales, :cambiar_regimen
          )
          RETURNING protocolo_paciente_id INTO :id`,
        {
          paciente_id: toNum(pp.paciente_id),
          protocolo_id: toNum(pp.protocolo_id),
          regimen: toNum(pp.regimen),
          ciclo_actual_id: toNum(pp.ciclo_actual_id),
          numero_ciclo: toNum(pp.numero_ciclo),
          fecha_inicio: pp.fecha_inicio,
          fecha_fin: pp.fecha_fin,
          estado: toStr(pp.estado),
          profesional_id_asignador: toNum(pp.profesional_id_asignador),
          fecha_asignacion: pp.fecha_asignacion,
          ciclo_final: toNum(pp.ciclo_final),
          repeticiones_actuales: toNum(pp.repeticiones_actuales),
          cambiar_regimen: toNum(pp.cambiar_regimen),
          id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
        },
        { autoCommit: true }
      );

      const id = result?.outBinds?.id?.[0];
      if (!id) throw new Error(ERROR_PROTOCOLO_PACIENTE_CREACION);

      pp.protocolo_paciente_id = id;
      return id;
    } catch (err) {
      if (err.errorNum === FK_NOT_EXISTENT_CODE) {
        if (err.message.includes('FK_PP_PACIENTE')) {
          // Foreign key violation: paciente no existe
          throw new Error(ERROR_PACIENTE_PARA_PROTOCOLO_NO_ENCONTRADO);
        }
        else if (err.message.includes('FK_PP_CICLO')) {
          // Foreign key violation: ciclo no existe
          throw new Error(ERROR_CICLO_PARA_PROTOCOLO_NO_ENCONTRADO);
        }
      }
      throw err; // re-lanzar cualquier otro error
    }
  }

  // Obtener un protocolo de un paciente por paciente_id y opcional protocolo_id
  async obtenerPorPaciente(paciente_id, protocolo_id = null) {
    let query = 'SELECT * FROM protocolo_paciente WHERE paciente_id = :paciente_id';
    const binds = { paciente_id };

    if (protocolo_id !== null) {
      query += ' AND protocolo_id = :protocolo_id';
      binds.protocolo_id = protocolo_id;
    }

    const result = await this.connection.execute(query, binds);

    if (result.rows.length === 0) {
      throw new Error(ERROR_PROTOCOLO_PACIENTE_NO_ENCONTRADO);
    }

    return result.rows.map(row => new ProtocoloPaciente({
      protocolo_paciente_id: row.PROTOCOLO_PACIENTE_ID,
      paciente_id: row.PACIENTE_ID,
      protocolo_id: row.PROTOCOLO_ID,
      regimen: row.REGIMEN,
      ciclo_actual_id: row.CICLO_ACTUAL_ID,
      numero_ciclo: row.NUMERO_CICLO,
      fecha_inicio: row.FECHA_INICIO,
      fecha_fin: row.FECHA_FIN,
      estado: row.ESTADO,
      profesional_id_asignador: row.PROFESIONAL_ID_ASIGNADOR,
      fecha_asignacion: row.FECHA_ASIGNACION,
      ciclo_final: row.CICLO_FINAL === '1',
      repeticiones_actuales: row.REPETICIONES_ACTUALES,
      cambiar_regimen: row.CAMBIAR_REGIMEN === '1'
    }));
  }

  // Actualización parcial de protocolo_paciente
  async actualizarParcialmente(protocolo_paciente_id, campos) {
    const keys = Object.keys(campos);
    if (keys.length === 0) {
      return protocolo_paciente_id;
    }

    const setStatements = [];
    const bindParams = {};

    // Formatear campos según tipo
    const formattedFields = {
      regimen: campos.regimen !== undefined ? toNum(campos.regimen) : undefined,
      ciclo_actual_id: campos.ciclo_actual_id !== undefined ? toNum(campos.ciclo_actual_id) : undefined,
      numero_ciclo: campos.numero_ciclo !== undefined ? toNum(campos.numero_ciclo) : undefined,
      fecha_inicio: campos.fecha_inicio,
      fecha_fin: campos.fecha_fin,
      estado: campos.estado,
      profesional_id_asignador: campos.profesional_id_asignador !== undefined ? toNum(campos.profesional_id_asignador) : undefined,
      fecha_asignacion: campos.fecha_asignacion,
      ciclo_final: toNum(campos.ciclo_final),
      repeticiones_actuales: toNum(campos.repeticiones_actuales),
      cambiar_regimen: toNum(campos.cambiar_regimen)
    };

    for (const key of keys) {
      if (formattedFields[key] !== undefined) {
        setStatements.push(`${key} = :${key}`);
        bindParams[key] = formattedFields[key];
      }
    }
    //setStatements.push('ultima_modificacion = SYSDATE');
    const setClause = setStatements.join(', ');
    bindParams.protocolo_paciente_id = toNum(protocolo_paciente_id);

    const sql = `
      UPDATE protocolo_paciente
      SET ${setClause}
      WHERE protocolo_paciente_id = :protocolo_paciente_id
    `;

    const result = await this.connection.execute(sql, bindParams, { autoCommit: true });
    if (result.rowsAffected === 0) {
      throw new Error('Protocolo paciente no encontrado');
    }
    return protocolo_paciente_id;
  }

}
