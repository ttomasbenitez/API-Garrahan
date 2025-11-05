export default class CalculoDroga {
  constructor({ fuerza_valor, cantidad_dias, frecuencia_diaria, peso, nueva_fuerza_valor, fuerza_unidad }) {
    this.fuerza_valor = Number(fuerza_valor);
    this.cantidad_dias = Number(cantidad_dias);
    this.frecuencia_diaria = Number(frecuencia_diaria);
    this.peso = Number(peso);
    this.nueva_fuerza_valor = Number(nueva_fuerza_valor);
    this.fuerza_unidad = fuerza_unidad;
  }

  getCantidadBase() {
    return this.fuerza_valor * this.cantidad_dias * this.frecuencia_diaria;
  }

  getCantidadTotal() {
    return this.getCantidadBase() * this.peso;
  }

  getUnidades() {
    if (!this.nueva_fuerza_valor || this.nueva_fuerza_valor === 0) return 0;
    return Math.ceil(this.getCantidadTotal() / this.nueva_fuerza_valor);
  }
}
