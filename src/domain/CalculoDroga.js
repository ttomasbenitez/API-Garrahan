const FACTOR_GR_A_MG = 1000;
const FACTOR_MCG_A_MG = 1 / 1000;

const UNIDAD_GRAMO = 'gr';
const UNIDAD_MICROGRAMO = 'μg';

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
    via_codigo,
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
    this.via_codigo = via_codigo;
  }

  /**
   * Calcula la Superficie Corporal Pediátrica.
   */
  calcularSuperficieCorporalPediatrica() {
    const FACTOR_A = 4;
    const FACTOR_B = 7;
    const FACTOR_C = 90;
    return (this.peso * FACTOR_A + FACTOR_B) / (this.peso + FACTOR_C);
  }

  /**
   * Calcula la dosis total diaria en Miligramos (mg).
   * Dosis Requerida (mg/m2 o mg/kg) * Factor de Cálculo (m2 o kg)
   */
  getDosisTotalDiariaEnMg() {
    let factorCalculo = 1;

    if (this.unidad_por === UNIDAD_POR_M2) {
      factorCalculo = this.calcularSuperficieCorporalPediatrica();
    } else if (this.unidad_por === UNIDAD_POR_KG) {
      factorCalculo = this.peso;
    }

    // Dosis diaria es: Dosis base por unidad * Factor de Cálculo * Frecuencia Diaria
    const dosisDiariaEnMg = this.dosis_requerida_mg_por_unidad * factorCalculo;
    return dosisDiariaEnMg;
  }

  /**
   * Retorna la dosis total para todo el período de tratamiento en Miligramos.
   */
  getDosisTotal() {
    const dosisDiariaEnMg = this.getDosisTotalDiariaEnMg();
    const dosisTotalEnMg = dosisDiariaEnMg * this.cantidad_dias * this.frecuencia_diaria;
    return dosisTotalEnMg;
  }

  // Retorna la cantidad base (para todo el período)
  getCantidadBase() {
    const cantidadBaseEnMgPorUnidad = this.dosis_requerida_mg_por_unidad * this.cantidad_dias * this.frecuencia_diaria;
    const valorReconvertido = CalculoDroga.reconvertirValor(cantidadBaseEnMgPorUnidad, this.fuerza_unidad_requerida);

    return {
      valor: valorReconvertido.toFixed(2),
      unidad: this.fuerza_unidad_requerida,
    };
  }

  // Retorna la cantidad total (para todo el período) en la unidad de presentación
  getCantidadTotal() {
    const dosisTotalEnMg = this.getDosisTotal();
    const valorReconvertido = CalculoDroga.reconvertirValor(dosisTotalEnMg, this.nueva_fuerza_unidad);

    return {
      valor: valorReconvertido.toFixed(2),
      unidad: this.nueva_fuerza_unidad,
    };
  }

  /**
   * Retorna la dosis total requerida para un solo día de tratamiento
   * para el paciente, en la unidad de la presentación.
   */
  getDosisDiaria() {
    const dosisDiariaEnMg = this.getDosisTotalDiariaEnMg() * this.frecuencia_diaria;

    const valorReconvertido = CalculoDroga.reconvertirValor(dosisDiariaEnMg, this.nueva_fuerza_unidad);

    return {
      valor: valorReconvertido.toFixed(2),
      unidad: this.nueva_fuerza_unidad,
    };
  }

  getUnidades() {
    if (!this.fuerza_presentacion_mg || this.fuerza_presentacion_mg === 0) {
      return 0;
    }

    // Para drogas intravenosas (vía IV), el excedente de cada día se descarta
    if (this.via_codigo === 'IV') {
      // Calcular la dosis diaria total en mg (todas las dosis del día)
      const dosisDiariaEnMg = this.getDosisTotalDiariaEnMg() * this.frecuencia_diaria;

      // Calcular cuántas unidades se necesitan por día (redondeando hacia arriba)
      const unidadesPorDia = Math.ceil(dosisDiariaEnMg / this.fuerza_presentacion_mg);

      // Multiplicar por la cantidad de días
      return unidadesPorDia * this.cantidad_dias;
    }

    // Para otras vías de administración, se calcula sobre el total acumulado
    const dosisTotalEnMg = this.getDosisTotal();
    return Math.ceil(dosisTotalEnMg / this.fuerza_presentacion_mg);
  }
}
