/* global describe, test, expect */
import CalculoDroga from '../../src/domain/CalculoDroga.js';

describe('CalculoDroga (dominio)', () => {
  const PESO = 25;
  const CANTIDAD_DIAS = 7;
  const FRECUENCIA_DIARIA = 1;

  test('debe calcular correctamente la dosis y unidades cuando todo está en mg (SC estimada)', () => {
    const params = {
      fuerza_valor_requerida: 100,
      fuerza_unidad_requerida: 'mg',
      cantidad_dias: CANTIDAD_DIAS,
      frecuencia_diaria: FRECUENCIA_DIARIA,
      peso: PESO,
      nueva_fuerza_valor: 500,
      nueva_fuerza_unidad: 'mg'
    };
    const calculo = new CalculoDroga(params);

    expect(calculo.getCantidadBase()).toBe('700.00');

    expect(calculo.getCantidadTotal()).toBe('651.30');

    expect(calculo.getUnidades()).toBe(2);
  });

  test('debe normalizar dosis de gr a mg correctamente (SC estimada)', () => {
    const params = {
      fuerza_valor_requerida: 10,
      fuerza_unidad_requerida: 'gr',
      cantidad_dias: CANTIDAD_DIAS,
      frecuencia_diaria: FRECUENCIA_DIARIA,
      peso: PESO,
      nueva_fuerza_valor: 1000,
      nueva_fuerza_unidad: 'mg'
    };
    const calculo = new CalculoDroga(params);

    expect(calculo.getCantidadBase()).toBe('70000.00');

    expect(calculo.getCantidadTotal()).toBe('65130.43');

    expect(calculo.getUnidades()).toBe(66);
  });

  test('debe normalizar la fuerza de la presentación de gr a mg correctamente (SC estimada)', () => {
    const params = {
      fuerza_valor_requerida: 200,
      fuerza_unidad_requerida: 'mg',
      cantidad_dias: CANTIDAD_DIAS,
      frecuencia_diaria: FRECUENCIA_DIARIA,
      peso: PESO,
      nueva_fuerza_valor: 5,
      nueva_fuerza_unidad: 'gr'
    };
    const calculo = new CalculoDroga(params);

    expect(calculo.getCantidadBase()).toBe('1400.00');

    expect(calculo.getCantidadTotal()).toBe('1302.61');

    expect(calculo.getUnidades()).toBe(1);
  });

  test('debe manejar valores decimales y redondear las unidades correctamente (SC estimada)', () => {
    const params = {
      fuerza_valor_requerida: 33.33,
      fuerza_unidad_requerida: 'mg',
      cantidad_dias: 3,
      frecuencia_diaria: 1,
      peso: 1.0,
      nueva_fuerza_valor: 10,
      nueva_fuerza_unidad: 'mg'
    };
    const calculo = new CalculoDroga(params);

    expect(calculo.getCantidadTotal()).toBe('12.09');

    expect(calculo.getUnidades()).toBe(2);
  });

  test('debe retornar 0 si la fuerza de la presentación es cero (SC estimada)', () => {
    const params = {
      fuerza_valor_requerida: 100,
      fuerza_unidad_requerida: 'mg',
      cantidad_dias: 7,
      frecuencia_diaria: 1,
      peso: 1.5,
      nueva_fuerza_valor: 0,
      nueva_fuerza_unidad: 'mg'
    };
    const calculo = new CalculoDroga(params);

    expect(calculo.getUnidades()).toBe(0);
  });
});
