/* global describe, test, expect */
import CalculoDroga from '../../src/domain/CalculoDroga.js';

describe('CalculoDroga (dominio)', () => {
  const SC_MOCK = 1.5;
  const CANTIDAD_DIAS = 7;
  const FRECUENCIA_DIARIA = 1;

  // --- ESCENARIO 1: Dosis Requerida en mg, Presentación en mg ---
  test('debe calcular correctamente la dosis y unidades cuando todo está en mg', () => {
    const params = {
      fuerza_valor_requerida: 100, // 100 mg/m2
      fuerza_unidad_requerida: 'mg',
      cantidad_dias: CANTIDAD_DIAS,
      frecuencia_diaria: FRECUENCIA_DIARIA,
      imc: SC_MOCK, // 1.5 m2
      nueva_fuerza_valor: 500, // Presentación de 500 mg
      nueva_fuerza_unidad: 'mg'
    };
    const calculo = new CalculoDroga(params);
    // Dosis total por m2 para el tratamiento: 100 mg/m2 * 7 días * 1 = 700 mg/m2
    expect(calculo.getCantidadBase()).toBe(700.00);

    // Dosis Total (mg): 700 mg/m2 * 1.5 m2 = 1050 mg
    expect(calculo.getCantidadTotal()).toBe(1050.00);
    // Unidades (Math.ceil(1050 mg / 500 mg)): 2.1 -> 3
    expect(calculo.getUnidades()).toBe(3);
  });

  // --- ESCENARIO 2: Requerido en gramos (gr), Presentación en miligramos (mg) ---
  test('debe normalizar dosis de gr a mg correctamente', () => {
    const params = {
      fuerza_valor_requerida: 10, // 10 gr/m2 -> 10000 mg/m2
      fuerza_unidad_requerida: 'gr',
      cantidad_dias: CANTIDAD_DIAS,
      frecuencia_diaria: FRECUENCIA_DIARIA,
      imc: SC_MOCK, // 1.5 m2
      nueva_fuerza_valor: 1000, // Presentación de 1000 mg (1g)
      nueva_fuerza_unidad: 'mg'
    };
    const calculo = new CalculoDroga(params);
    // Dosis total por m2 para el tratamiento: 10000 mg/m2 * 7 días * 1 = 70000 mg/m2
    expect(calculo.getCantidadBase()).toBe(70000.00);

    // Dosis Total (mg): 70000 mg/m2 * 1.5 m2 = 105000 mg
    expect(calculo.getCantidadTotal()).toBe(105000.00);
    // Unidades (Math.ceil(105000 mg / 1000 mg)): 105 -> 105
    expect(calculo.getUnidades()).toBe(105);
  });
  // --- ESCENARIO 3: Requerido en miligramos (mg), Presentación en gramos (gr) ---
  test('debe normalizar la fuerza de la presentación de gr a mg correctamente', () => {
    const params = {
      fuerza_valor_requerida: 200, // 200 mg/m2
      fuerza_unidad_requerida: 'mg',
      cantidad_dias: CANTIDAD_DIAS,
      frecuencia_diaria: FRECUENCIA_DIARIA,
      imc: SC_MOCK, // 1.5 m2
      nueva_fuerza_valor: 5, // Presentación de 5 gr -> 5000 mg
      nueva_fuerza_unidad: 'gr'
    };
    const calculo = new CalculoDroga(params);
    // Dosis total por m2 para el tratamiento: 200 mg/m2 * 7 días * 1 = 1400 mg/m2
    expect(calculo.getCantidadBase()).toBe(1400.00);

    // Dosis Total (mg): 1400 mg/m2 * 1.5 m2 = 2100 mg
    expect(calculo.getCantidadTotal()).toBe(2100.00);
    // Unidades (Math.ceil(2100 mg / 5000 mg)): 0.42 -> 1
    expect(calculo.getUnidades()).toBe(1);
  });
  // --- ESCENARIO 4: Valores con decimales y redondeo ---
  test('debe manejar valores decimales y redondear las unidades correctamente', () => {
    const params = {
      fuerza_valor_requerida: 33.33,
      fuerza_unidad_requerida: 'mg',
      cantidad_dias: 3,
      frecuencia_diaria: 1,
      imc: 1.0, // SC: 1.0 m2
      nueva_fuerza_valor: 10, // Presentación de 10 mg
      nueva_fuerza_unidad: 'mg'
    };
    const calculo = new CalculoDroga(params);

    // Dosis Total (mg): 33.33 * 3 * 1 * 1.0 = 99.99 mg
    expect(calculo.getCantidadTotal()).toBe(99.99);
    // Unidades (Math.ceil(99.99 / 10)): 9.999 -> 10
    expect(calculo.getUnidades()).toBe(10);
  });

  // --- ESCENARIO 5: Manejo de valores cero o nulos ---
  test('debe retornar 0 si la fuerza de la presentación es cero', () => {
    const params = {
      fuerza_valor_requerida: 100,
      fuerza_unidad_requerida: 'mg',
      cantidad_dias: 7,
      frecuencia_diaria: 1,
      imc: 1.5,
      nueva_fuerza_valor: 0,
      nueva_fuerza_unidad: 'mg'
    };
    const calculo = new CalculoDroga(params);

    // getUnidades debe manejar la división por cero
    expect(calculo.getUnidades()).toBe(0);
  });
});
