import oracledb from 'oracledb';
import ProtocoloPaciente from '../domain/protocoloPaciente.js';
import { ERROR_PROTOCOLO_PACIENTE_CREACION, ERROR_PROTOCOLO_PACIENTE_NO_ENCONTRADO,
  ERROR_PACIENTE_PARA_PROTOCOLO_NO_ENCONTRADO, ERROR_CICLO_PARA_PROTOCOLO_NO_ENCONTRADO } from '../errors/protocoloPaciente.js';

const FK_NOT_EXISTENT_CODE = 2291;

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
            profesional_id_asignador, fecha_asignacion
          ) VALUES (
            :paciente_id, :protocolo_id, :regimen, :ciclo_actual_id,
            :numero_ciclo, :fecha_inicio, :fecha_fin, :estado,
            :profesional_id_asignador, :fecha_asignacion
          )
          RETURNING protocolo_paciente_id INTO :id`,
        {
          paciente_id: pp.paciente_id,
          protocolo_id: pp.protocolo_id,
          regimen: pp.regimen,
          ciclo_actual_id: pp.ciclo_actual_id,
          numero_ciclo: pp.numero_ciclo,
          fecha_inicio: pp.fecha_inicio,
          fecha_fin: pp.fecha_fin,
          estado: pp.estado,
          profesional_id_asignador: pp.profesional_id_asignador,
          fecha_asignacion: pp.fecha_asignacion,
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
      fecha_asignacion: row.FECHA_ASIGNACION
    }));
  }
}
