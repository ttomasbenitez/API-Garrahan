/* global describe, test, expect */
import CalculoDroga from '../../src/domain/CalculoDroga.js';

describe('CalculoDroga (dominio)', () => {
  test('calcula correctamente la cantidad base, total y unidades', () => {
    const calc = new CalculoDroga({
      fuerza_valor: 50,
      cantidad_dias: 4,
      frecuencia_diaria: 2,
      peso: 10,
      nueva_fuerza_valor: 500,
      fuerza_unidad: 'mg/m2'
    });
    expect(calc.getCantidadBase()).toBe(400); // 50*4*2
    expect(calc.getCantidadTotal()).toBe(4000); // 400*10
    expect(calc.getUnidades()).toBe(8); // 4000/500
  });

  test('devuelve 0 unidades si nueva fuerza valor es 0', () => {
    const calc = new CalculoDroga({
      fuerza_valor: 50,
      cantidad_dias: 4,
      frecuencia_diaria: 2,
      peso: 10,
      nueva_fuerza_valor: 0,
      fuerza_unidad: 'mg/m2'
    });
    expect(calc.getUnidades()).toBe(0);
  });
});
