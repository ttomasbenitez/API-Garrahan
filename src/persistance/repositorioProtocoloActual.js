import AdministracionDetalladaDTO from '../domain/administracionDetalladaDTO.js';
import ProtocoloActualDTO from '../domain/protocoloActualDTO.js';
import { ERROR_PROTOCOLO_ACTUAL_INEXISTENTE } from '../errors/protocoloActual.js';

export class RepositorioProtocoloActual {
  constructor(connection) {
    this.connection = connection;
  }

  async obtenerProtocoloActualDetallado(pacienteId) {
    const sql = `
      SELECT
          PP.protocolo_id,
          PP.protocolo_paciente_id,
          PP.ciclo_actual_id AS ciclo_id,
          PP.regimen,
          PP.cambiar_regimen,
          P.nombre AS protocolo_nombre,
          AM.admin_id,
          D.droga_id,
          D.nombre_generico AS nombre_droga,
          VA.nombre AS via_administracion,
          AM.fuerza_valor,
          AM.fuerza_unidad,
          AM.cantidad_dias,
          AM.frecuencia_diaria,
          FF.nombre AS formato_droga
      FROM
          protocolo_paciente PP
      JOIN
          protocolo P ON PP.protocolo_id = P.protocolo_id
      JOIN
          administracion_medicacion AM
            ON PP.protocolo_id = AM.protocolo_id
            AND PP.ciclo_actual_id = AM.ciclo_id
            AND PP.regimen = AM.regimen
      JOIN
          droga D ON AM.droga_id = D.droga_id
      JOIN
          via_administracion VA ON AM.via_id = VA.via_id
      LEFT JOIN
          presentacion_droga_via PDV
            ON AM.via_id = PDV.via_id
            AND PDV.es_default = '1'
      LEFT JOIN
          presentacion_droga PR
            ON PDV.presentacion_id = PR.presentacion_id
      LEFT JOIN
          forma_farmaceutica FF
            ON PR.forma_farmaceutica_id = FF.forma_farmaceutica_id
      WHERE
          PP.paciente_id = :pacienteId
    `;

    const result = await this.connection.execute(sql, { pacienteId });
    const filas = result.rows;

    if (!filas || filas.length === 0) {
      throw new Error(ERROR_PROTOCOLO_ACTUAL_INEXISTENTE);
    }
    const primeraFila = filas[0];

    const administracionesDetalladas = filas.map(row =>
      new AdministracionDetalladaDTO(
        row.ADMIN_ID,
        row.NOMBRE_DROGA,
        row.DROGA_ID,
        row.VIA_ADMINISTRACION,
        row.FORMATO_DROGA,
        row.FUERZA_VALOR,
        row.FUERZA_UNIDAD,
        row.CANTIDAD_DIAS,
        row.FRECUENCIA_DIARIA
      )
    );

    return new ProtocoloActualDTO(
      primeraFila.PROTOCOLO_ID,
      primeraFila.PROTOCOLO_PACIENTE_ID,
      primeraFila.PROTOCOLO_NOMBRE,
      primeraFila.REGIMEN,
      primeraFila.CAMBIAR_REGIMEN === '1',
      primeraFila.CICLO_ID,
      administracionesDetalladas
    );
  }

}
