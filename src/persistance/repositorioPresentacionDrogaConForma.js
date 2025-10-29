import PresentacionDrogaDTO from '../domain/presentacionDrogaDTO.js';

export class RepositorioPresentacionDrogaConForma {
  constructor(db) {
    this.db = db;
  }

  async listar(droga_id) {
    try {
      const result = await this.db.execute(
        `SELECT pd.droga_id,
                pd.forma_farmaceutica_id,
                ff.nombre AS forma_farmaceutica_nombre,
                pd.estado,
                pd.fuerza_valor,
                pd.fuerza_unidad,
                pd.presentacion_id
            FROM presentacion_droga pd
            JOIN forma_farmaceutica ff
            ON pd.forma_farmaceutica_id = ff.forma_farmaceutica_id
            WHERE pd.droga_id = :droga_id`,
        { droga_id }
      );

      return result.rows.map(row => new PresentacionDrogaDTO(row.DROGA_ID,
        row.FORMA_FARMACEUTICA_ID, row.FORMA_FARMACEUTICA_NOMBRE, row.CODIGO_FARMACIA, row.ESTADO,
        row.FUERZA_VALOR, row.FUERZA_UNIDAD, row.PRESENTACION_ID));
    } catch (error) {
      console.error('Error en RepositorioPresentacionDroga.listar:', error);
      throw error;
    }
  }
}
