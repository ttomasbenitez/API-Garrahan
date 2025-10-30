export default class CalculoDroga {
  constructor({ fuerza_valor_requerida, fuerza_unidad_requerida, cantidad_dias, frecuencia_diaria, peso, nueva_fuerza_valor, nueva_fuerza_unidad }) {

    const normalizarAMiligramos = (valor, unidad) => {
      const valorNumerico = valor;
      if (isNaN(valorNumerico)) return 0;

      if (unidad && typeof unidad === 'string' && unidad.toLowerCase().includes('gr')) {
        return valorNumerico * 1000;
      }

      return valorNumerico;
    };

    // Dosis Requerida: Normalizada a mg/m2
    this.dosis_requerida_mg_m2 = normalizarAMiligramos(fuerza_valor_requerida, fuerza_unidad_requerida);

    // Presentación Elegida: Normalizada a mg por unidad (si la presentación es en "gr")
    this.fuerza_presentacion_mg = normalizarAMiligramos(nueva_fuerza_valor, nueva_fuerza_unidad);
    this.fuerza_unidad = 'mg';
    this.cantidad_dias = cantidad_dias;
    this.frecuencia_diaria = frecuencia_diaria;
    this.peso = peso;
  }

  calcularSuperficieCorporalPediatrica() {
    return (this.peso * 4 + 7) / (this.peso + 90);
  }

  getCantidadBase() {
    const cantidadBase = this.dosis_requerida_mg_m2 * this.cantidad_dias * this.frecuencia_diaria;
    return cantidadBase.toFixed(2);
  }

  getCantidadTotal() {
    const cantidadTotal = this.dosis_requerida_mg_m2 * this.cantidad_dias * this.frecuencia_diaria * this.calcularSuperficieCorporalPediatrica();
    return cantidadTotal.toFixed(2);
  }

  getUnidades() {
    if (!this.fuerza_presentacion_mg || this.fuerza_presentacion_mg === 0) return 0;
    const cantidadTotalNumerica = this.dosis_requerida_mg_m2 * this.cantidad_dias * this.frecuencia_diaria * this.calcularSuperficieCorporalPediatrica();

    return Math.ceil(cantidadTotalNumerica / this.fuerza_presentacion_mg);
  }
}
