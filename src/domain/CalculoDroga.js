const FACTOR_GR_A_MG = 1000;
const FACTOR_MCG_A_MG = 1 / 1000;

const UNIDAD_GRAMO = 'gr';
const UNIDAD_MICROGRAMO = 'μg';
const UNIDAD_MILIGRAMO = 'mg';

const UNIDAD_POR_M2 = '/m2';
const UNIDAD_POR_KG = '/kg';


export default class CalculoDroga {
  /**
   * Normaliza un valor de masa a Miligramos (mg).
   */
  static normalizarAMiligramos(valor, unidad) {
    const valorNumerico = parseFloat(valor);
    if (isNaN(valorNumerico) || valorNumerico === 0) return 0;

    // Eliminamos las unidades de cálculo para normalizar solo la masa
    const unidadLimpia = (unidad || '').toLowerCase()
      .replace(UNIDAD_POR_M2, '')
      .replace(UNIDAD_POR_KG, '')
      .trim();

    if (unidadLimpia.includes(UNIDAD_GRAMO)) {
      return valorNumerico * FACTOR_GR_A_MG;
    }
    if (unidadLimpia.includes(UNIDAD_MICROGRAMO)) {
      return valorNumerico * FACTOR_MCG_A_MG;
    }
    return valorNumerico;
  }

  /**
   * Reconvierte un valor que está en Miligramos (mg) a la unidad deseada.
   */
  static reconvertirValor(valorEnMg, unidadDeseada) {
    // Eliminamos las unidades de cálculo para buscar solo la masa
    const unidadLimpia = (unidadDeseada || '').toLowerCase()
      .replace(UNIDAD_POR_M2, '')
      .replace(UNIDAD_POR_KG, '')
      .trim();

    if (unidadLimpia.includes(UNIDAD_GRAMO)) {
      return valorEnMg / FACTOR_GR_A_MG;
    }
    if (unidadLimpia.includes(UNIDAD_MICROGRAMO)) {
      return valorEnMg / FACTOR_MCG_A_MG;
    }
    return valorEnMg;
  }

  constructor({
    fuerza_valor_requerida,
    fuerza_unidad_requerida,
    cantidad_dias,
    frecuencia_diaria,
    peso,
    nueva_fuerza_valor,
    nueva_fuerza_unidad,
  }) {

    const unidadRequeridaLower = (fuerza_unidad_requerida || '').toLowerCase();

    const unidadPor = unidadRequeridaLower.includes(UNIDAD_POR_M2) ? UNIDAD_POR_M2 :
      unidadRequeridaLower.includes(UNIDAD_POR_KG) ? UNIDAD_POR_KG : '';

    this.dosis_requerida_mg_por_unidad = CalculoDroga.normalizarAMiligramos(fuerza_valor_requerida, fuerza_unidad_requerida);
    this.unidad_por = unidadPor;
    this.fuerza_unidad_requerida = fuerza_unidad_requerida;

    this.fuerza_presentacion_mg = CalculoDroga.normalizarAMiligramos(nueva_fuerza_valor, nueva_fuerza_unidad);
    this.nueva_fuerza_unidad = nueva_fuerza_unidad;

    this.cantidad_dias = cantidad_dias;
    this.frecuencia_diaria = frecuencia_diaria;
    this.peso = peso;
  }

  /**
   * Calcula la Superficie Corporal Pediátrica.
   */
  calcularSuperficieCorporalPediatrica() {
    // Los números 4, 7, 90 son parte de la fórmula matemática y son constantes de dominio
    const FACTOR_A = 4;
    const FACTOR_B = 7;
    const FACTOR_C = 90;
    return (this.peso * FACTOR_A + FACTOR_B) / (this.peso + FACTOR_C);
  }

  getDosisTotal() {
    let factorCalculo = 1;

    if (this.unidad_por === UNIDAD_POR_M2) {
      factorCalculo = this.calcularSuperficieCorporalPediatrica();
    } else if (this.unidad_por === UNIDAD_POR_KG) {
      factorCalculo = this.peso;
    }

    const dosisTotalEnMg = this.dosis_requerida_mg_por_unidad * this.cantidad_dias * this.frecuencia_diaria * factorCalculo;
    return dosisTotalEnMg;
  }

  // Retorna la cantidad base
  getCantidadBase() {
    const cantidadBaseEnMgPorUnidad = this.dosis_requerida_mg_por_unidad * this.cantidad_dias * this.frecuencia_diaria;
    const valorReconvertido = CalculoDroga.reconvertirValor(cantidadBaseEnMgPorUnidad, this.fuerza_unidad_requerida);

    return {
      valor: valorReconvertido.toFixed(2),
      unidad: this.fuerza_unidad_requerida,
    };
  }

  // Retorna la cantidad total
  getCantidadTotal() {
    const dosisTotalEnMg = this.getDosisTotal();
    const valorReconvertido = CalculoDroga.reconvertirValor(dosisTotalEnMg, this.nueva_fuerza_unidad);

    return {
      valor: valorReconvertido.toFixed(2),
      unidad: this.nueva_fuerza_unidad,
    };
  }

  getUnidades() {
    const dosisTotalEnMg = this.getDosisTotal();

    if (!this.fuerza_presentacion_mg || this.fuerza_presentacion_mg === 0) {
      return 0;
    }

    return Math.ceil(dosisTotalEnMg / this.fuerza_presentacion_mg);
  }
}
