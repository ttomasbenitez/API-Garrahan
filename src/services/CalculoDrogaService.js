import CalculoDroga from '../domain/CalculoDroga.js';

export class CalculoDrogaService {
  constructor(repositorioAdministracion) {
    this.repositorioAdministracion = repositorioAdministracion;
  }

  /**
   * Calcula la cantidad de droga total y unidades a pedir
   * @param {Object} params
   * @param {number} params.administracion_id
   * @param {number} params.peso
   * @param {number} params.nueva_fuerza_valor
   * @param {string} params.nueva_fuerza_unidad
   */
  async calcular({ administracion_id, peso, nueva_fuerza_valor, nueva_fuerza_unidad }) {
    const admin = await this.repositorioAdministracion.getById(administracion_id);
    if (!admin) throw new Error('Administración no encontrada');

    const calculo = new CalculoDroga({
      fuerza_valor_requerida: admin.FUERZA_VALOR,
      fuerza_unidad_requerida: admin.FUERZA_UNIDAD,
      cantidad_dias: admin.CANTIDAD_DIAS,
      frecuencia_diaria: admin.FRECUENCIA_DIARIA,
      peso,
      nueva_fuerza_valor,
      nueva_fuerza_unidad: nueva_fuerza_unidad || admin.FUERZA_UNIDAD,
      via_codigo: admin.VIA_CODIGO
    });

    return {
      dosis_diaria: calculo.getDosisDiaria(),
      cantidad_total: calculo.getCantidadTotal(),
      unidades: calculo.getUnidades(),
      fuerza_unidad: calculo.fuerza_unidad,
      nueva_fuerza_valor: calculo.nueva_fuerza_valor
    };
  }
}
