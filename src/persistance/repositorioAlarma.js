import Alarma from '../domain/alarma/alarma.js';
import { toNum } from '../utils/formatters.js';

export class RepositorioAlarma {
  constructor(db) {
    this.db = db;
  }

  /**
   * Obtiene todas las alarmas ordenadas por días transcurridos
   */
  async listar() {
    const result = await this.db.execute(
      `SELECT alarma_id, paciente_id, fecha_ultima_receta, dias_transcurridos
       FROM alarmas
       ORDER BY dias_transcurridos DESC`
    );

    const alarmas = [];
    for (const row of result.rows) {
      alarmas.push(new Alarma(
        row.ALARMA_ID,
        row.PACIENTE_ID,
        row.FECHA_ULTIMA_RECETA ? new Date(row.FECHA_ULTIMA_RECETA).toISOString().split('T')[0] : null,
        row.DIAS_TRANSCURRIDOS
      ));
    }

    return alarmas;
  }

  /**
   * Limpia todas las alarmas de la tabla
   */
  async limpiar() {
    const result = await this.db.execute(
      'DELETE FROM alarmas',
      {},
      { autoCommit: true }
    );

    return result.rowsAffected;
  }

  /**
   * Guarda múltiples alarmas en lote
   * @param {Array<{paciente_id: number, fecha_ultima_receta: Date, dias_transcurridos: number}>} alarmas
   */
  async guardarLote(alarmas) {
    if (!alarmas || alarmas.length === 0) {
      return 0;
    }

    const result = await this.db.executeMany(
      `INSERT INTO alarmas (paciente_id, fecha_ultima_receta, dias_transcurridos)
       VALUES (:paciente_id, :fecha_ultima_receta, :dias_transcurridos)`,
      alarmas.map(a => ({
        paciente_id: toNum(a.paciente_id),
        fecha_ultima_receta: a.fecha_ultima_receta,
        dias_transcurridos: toNum(a.dias_transcurridos)
      })),
      { autoCommit: true }
    );

    return result.rowsAffected;
  }
}
