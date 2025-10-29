import CalculoDroga from '../domain/CalculoDroga.js';

export class CalculoDrogaService {
  constructor(repositorioAdministracion) {
    this.repositorioAdministracion = repositorioAdministracion;
  }

  /**
   * Calcula la cantidad de droga total y unidades a pedir
   * @param {Object} params
   * @param {number} params.administracion_id
   * @param {number} params.imc
   * @param {number} params.nueva_fuerza_valor
   * @param {string} params.nueva_fuerza_unidad
   */
  async calcular({ administracion_id, imc, nueva_fuerza_valor, nueva_fuerza_unidad }) {
    // Buscar la administración por ID
    const admin = await this.repositorioAdministracion.getById(administracion_id);
    if (!admin) throw new Error('Administración no encontrada');

    // Crear entidad de dominio para el cálculo
    const calculo = new CalculoDroga({
      fuerza_valor: admin.FUERZA_VALOR,
      cantidad_dias: admin.CANTIDAD_DIAS,
      frecuencia_diaria: admin.FRECUENCIA_DIARIA,
      imc,
      nueva_fuerza_valor,
      fuerza_unidad: nueva_fuerza_unidad || admin.FUERZA_UNIDAD
    });

    return {
      cantidad_base: calculo.getCantidadBase(),
      cantidad_total: calculo.getCantidadTotal(),
      unidades: calculo.getUnidades(),
      fuerza_unidad: calculo.fuerza_unidad,
      nueva_fuerza_valor: calculo.nueva_fuerza_valor
    };
  }
}
