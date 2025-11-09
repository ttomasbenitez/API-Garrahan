import ConfiguracionAlarma from '../domain/alarma/configuracionAlarma.js';
import { toNum } from '../utils/formatters.js';
import { ERROR_CONFIGURACION_NO_ENCONTRADA, ERROR_CONFIGURACION_ACTUALIZACION } from '../errors/configuracionAlarma.js';

export class RepositorioConfiguracionAlarma {
  constructor(connection) {
    this.connection = connection;
  }

  async obtener() {
    const result = await this.connection.execute(
      `SELECT configuracion_id, limite_dias, ultima_ejecucion
       FROM configuracion_alarma
       WHERE ROWNUM = 1`
    );

    if (result.rows.length === 0) {
      throw new Error(ERROR_CONFIGURACION_NO_ENCONTRADA);
    }

    const row = result.rows[0];
    return new ConfiguracionAlarma(
      row.CONFIGURACION_ID,
      row.LIMITE_DIAS,
      row.ULTIMA_EJECUCION
    );
  }

  /**
   * Actualiza el límite de días de la configuración
   * @param {number} limiteDias - Nuevo límite en días
   */
  async actualizarLimite(limiteDias) {
    const result = await this.connection.execute(
      `UPDATE configuracion_alarma
       SET limite_dias = :limite_dias
       WHERE ROWNUM = 1`,
      {
        limite_dias: toNum(limiteDias)
      },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      throw new Error(ERROR_CONFIGURACION_ACTUALIZACION);
    }

    return true;
  }

  async actualizarUltimaEjecucion() {
    const result = await this.connection.execute(
      `UPDATE configuracion_alarma
       SET ultima_ejecucion = CURRENT_TIMESTAMP
       WHERE ROWNUM = 1`,
      {},
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      throw new Error(ERROR_CONFIGURACION_ACTUALIZACION);
    }

    return true;
  }
}
