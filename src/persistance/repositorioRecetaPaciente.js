import oracledb from 'oracledb';
import { ERROR_RECETA_PACIENTE_CREACION } from '../errors/receta.js';
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
      const result = await this.connection.execute(
        `INSERT INTO receta_paciente (
            protocolo_id, ciclo_id, regimen, paciente_id,
            profesional_id, estado,
            peso, talla, superficie_corporal
          ) VALUES (
            :protocolo_id, :ciclo_id, :regimen, :paciente_id,
            :profesional_id, :estado,
            :peso, :talla, :superficie_corporal
          )
          RETURNING receta_id, fecha_receta INTO :id, :fecha_receta`,
        {
          protocolo_id: toNum(rp.protocolo_id),
          ciclo_id: toNum(rp.ciclo_id),
          regimen: toNum(rp.regimen),
          paciente_id: toNum(rp.paciente_id),
          profesional_id: toNum(rp.profesional_id),
          estado: toStr(rp.estado),
          peso: toFloat(rp.peso),
          talla: toFloat(rp.talla),
          superficie_corporal: toFloat(rp.superficie_corporal),
          id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
          fecha_receta: { dir: oracledb.BIND_OUT, type: oracledb.DATE },
        },
        { autoCommit: true }
      );

      if (result.rowsAffected === 0) {
        throw new Error(ERROR_RECETA_PACIENTE_CREACION);
      }

      const id = result.outBinds.id[0];
      const fecha_receta = result.outBinds.fecha_receta[0];
      if (!id || !fecha_receta) throw new Error(ERROR_RECETA_PACIENTE_CREACION);

      rp.id = id;
      rp.fecha_receta = new Date(result.outBinds.fecha_receta[0]);
      return id;
    } catch (err) {
      if (err.errorNum === FK_NOT_EXISTENT_CODE) {
        const mappedError = mapRecetaPacienteInsertError(err);
        throw mappedError;
      }
      throw err;
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
