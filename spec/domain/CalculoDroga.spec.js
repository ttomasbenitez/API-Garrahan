/* global describe, test, expect */
import CalculoDroga from '../../src/domain/CalculoDroga.js';

// --- Constantes de Prueba ---
const PESO = 25; // kg
// SC: (25 * 4 + 7) / (25 + 90) = 107 / 115 ≈ 0.9304347826
const SC_CALCULADA = 107 / 115;
const CANTIDAD_DIAS = 7;
const FRECUENCIA_DIARIA = 1;

// --- Funciones de Ayuda para el Test ---
const toFixed = (number, decimals) => parseFloat(number.toFixed(decimals));
const toFixedString = (number, decimals) => toFixed(number, decimals).toFixed(decimals);

describe('CalculoDroga - Conversiones y Unidades', () => {

  test('debe calcular correctamente la dosis y unidades cuando todo está en mg/m2', () => {
    const fuerzaRequerida = 100;
    const presentacion = 500;
    const params = {
      fuerza_valor_requerida: fuerzaRequerida,
      fuerza_unidad_requerida: 'mg/m2',
      cantidad_dias: CANTIDAD_DIAS,
      frecuencia_diaria: FRECUENCIA_DIARIA,
      peso: PESO,
      nueva_fuerza_valor: presentacion,
      nueva_fuerza_unidad: 'mg'
    };
    const calculo = new CalculoDroga(params);

    const cantidadBase = fuerzaRequerida * CANTIDAD_DIAS * FRECUENCIA_DIARIA;
    expect(calculo.getCantidadBase()).toEqual({ valor: toFixedString(cantidadBase, 2), unidad: 'mg/m2' });

    const dosisTotalMg = cantidadBase * SC_CALCULADA;
    expect(calculo.getCantidadTotal()).toEqual({ valor: toFixedString(dosisTotalMg, 2), unidad: 'mg' });

    expect(calculo.getUnidades()).toBe(Math.ceil(dosisTotalMg / presentacion));
  });

  test('debe normalizar dosis de gr/m2 a mg/m2 y reconvertir la cantidad base a gr/m2', () => {
    const fuerzaRequeridaGr = 10;
    const presentacion = 1000;
    const params = {
      fuerza_valor_requerida: fuerzaRequeridaGr,
      fuerza_unidad_requerida: 'gr/m2',
      cantidad_dias: CANTIDAD_DIAS,
      frecuencia_diaria: FRECUENCIA_DIARIA,
      peso: PESO,
      nueva_fuerza_valor: presentacion,
      nueva_fuerza_unidad: 'mg'
    };
    const calculo = new CalculoDroga(params);
    const fuerzaRequeridaMg = fuerzaRequeridaGr * 1000;

    // Cantidad Base en mg/m2: 10000 * 7 * 1 = 70000 mg/m2
    // Reconvertido a gr/m2: 70000 / 1000 = 70 gr/m2
    const cantidadBaseGr = fuerzaRequeridaGr * CANTIDAD_DIAS * FRECUENCIA_DIARIA;
    expect(calculo.getCantidadBase()).toEqual({ valor: toFixedString(cantidadBaseGr, 2), unidad: 'gr/m2' });

    const dosisTotalMg = fuerzaRequeridaMg * CANTIDAD_DIAS * FRECUENCIA_DIARIA * SC_CALCULADA;
    expect(calculo.getCantidadTotal()).toEqual({ valor: toFixedString(dosisTotalMg, 2), unidad: 'mg' });

    expect(calculo.getUnidades()).toBe(Math.ceil(dosisTotalMg / presentacion));
  });

  test('debe normalizar la presentación de gr a mg y reconvertir la cantidad total a gr', () => {
    const fuerzaRequerida = 200;
    const presentacionGr = 5;
    const presentacionMg = presentacionGr * 1000;
    const params = {
      fuerza_valor_requerida: fuerzaRequerida,
      fuerza_unidad_requerida: 'mg/m2',
      cantidad_dias: CANTIDAD_DIAS,
      frecuencia_diaria: FRECUENCIA_DIARIA,
      peso: PESO,
      nueva_fuerza_valor: presentacionGr,
      nueva_fuerza_unidad: 'gr'
    };
    const calculo = new CalculoDroga(params);

    const cantidadBaseMg = fuerzaRequerida * CANTIDAD_DIAS * FRECUENCIA_DIARIA;
    expect(calculo.getCantidadBase()).toEqual({ valor: toFixedString(cantidadBaseMg, 2), unidad: 'mg/m2' });

    const dosisTotalMg = cantidadBaseMg * SC_CALCULADA;
    const cantidadTotalGr = dosisTotalMg / 1000;
    expect(calculo.getCantidadTotal()).toEqual({ valor: toFixedString(cantidadTotalGr, 2), unidad: 'gr' });

    expect(calculo.getUnidades()).toBe(Math.ceil(dosisTotalMg / presentacionMg));
  });

  test('debe normalizar dosis de μg/m2 y devolver la cantidad base en μg/m2 y total en μg', () => {
    const fuerzaRequeridaμg = 5000;
    const presentacionμg = 1000;
    const params = {
      fuerza_valor_requerida: fuerzaRequeridaμg,
      fuerza_unidad_requerida: 'μg/m2',
      cantidad_dias: CANTIDAD_DIAS,
      frecuencia_diaria: FRECUENCIA_DIARIA,
      peso: PESO,
      nueva_fuerza_valor: presentacionμg,
      nueva_fuerza_unidad: 'μg'
    };
    const calculo = new CalculoDroga(params);

    const cantidadBaseμg = fuerzaRequeridaμg * CANTIDAD_DIAS * FRECUENCIA_DIARIA;
    expect(calculo.getCantidadBase()).toEqual({ valor: toFixedString(cantidadBaseμg, 2), unidad: 'μg/m2' });

    const dosisTotalMg = (cantidadBaseμg / 1000) * SC_CALCULADA;
    const cantidadTotalμg = dosisTotalMg * 1000;
    expect(calculo.getCantidadTotal()).toEqual({ valor: toFixedString(cantidadTotalμg, 2), unidad: 'μg' });

    expect(calculo.getUnidades()).toBe(Math.ceil(dosisTotalMg / (presentacionμg / 1000)));
  });

  test('debe calcular la dosis cuando la unidad es mg/kg y devolver la unidad correcta', () => {
    const fuerzaRequerida = 2;
    const presentacion = 50;
    const params = {
      fuerza_valor_requerida: fuerzaRequerida,
      fuerza_unidad_requerida: 'mg/kg',
      cantidad_dias: CANTIDAD_DIAS,
      frecuencia_diaria: FRECUENCIA_DIARIA,
      peso: PESO,
      nueva_fuerza_valor: presentacion,
      nueva_fuerza_unidad: 'mg'
    };
    const calculo = new CalculoDroga(params);

    const cantidadBaseMgKg = fuerzaRequerida * CANTIDAD_DIAS * FRECUENCIA_DIARIA;
    expect(calculo.getCantidadBase()).toEqual({ valor: toFixedString(cantidadBaseMgKg, 2), unidad: 'mg/kg' });

    const dosisTotalMg = cantidadBaseMgKg * PESO;
    expect(calculo.getCantidadTotal()).toEqual({ valor: toFixedString(dosisTotalMg, 2), unidad: 'mg' });

    expect(calculo.getUnidades()).toBe(Math.ceil(dosisTotalMg / presentacion));
  });

  test('debe calcular la dosis cuando la unidad es μg/kg y devolver en gr', () => {
    const fuerzaRequeridaμg = 10;
    const dias = 30;
    const pesoMenor = 10;
    const presentacionGr = 0.1;
    const presentacionMg = presentacionGr * 1000;

    const params = {
      fuerza_valor_requerida: fuerzaRequeridaμg,
      fuerza_unidad_requerida: 'μg/kg',
      cantidad_dias: dias,
      frecuencia_diaria: FRECUENCIA_DIARIA,
      peso: pesoMenor,
      nueva_fuerza_valor: presentacionGr,
      nueva_fuerza_unidad: 'gr'
    };
    const calculo = new CalculoDroga(params);

    const cantidadBaseμgKg = fuerzaRequeridaμg * dias * FRECUENCIA_DIARIA;
    expect(calculo.getCantidadBase()).toEqual({ valor: toFixedString(cantidadBaseμgKg, 2), unidad: 'μg/kg' });

    const dosisTotalMg = (cantidadBaseμgKg / 1000) * pesoMenor;
    const cantidadTotalGr = dosisTotalMg / 1000;
    expect(calculo.getCantidadTotal()).toEqual({ valor: toFixedString(cantidadTotalGr, 2), unidad: 'gr' });

    expect(calculo.getUnidades()).toBe(Math.ceil(dosisTotalMg / presentacionMg));
  });

  test('debe manejar valores decimales y redondear las unidades correctamente', () => {
    const fuerzaRequerida = 33.33;
    const dias = 3;
    const pesoMenor = 1.0;
    const presentacion = 10;
    const SC_1KG = (pesoMenor * 4 + 7) / (pesoMenor + 90);

    const params = {
      fuerza_valor_requerida: fuerzaRequerida,
      fuerza_unidad_requerida: 'mg/m2',
      cantidad_dias: dias,
      frecuencia_diaria: FRECUENCIA_DIARIA,
      peso: pesoMenor,
      nueva_fuerza_valor: presentacion,
      nueva_fuerza_unidad: 'mg'
    };
    const calculo = new CalculoDroga(params);

    const dosisTotalMg = fuerzaRequerida * dias * FRECUENCIA_DIARIA * SC_1KG;
    expect(calculo.getCantidadTotal()).toEqual({ valor: toFixedString(dosisTotalMg, 2), unidad: 'mg' });

    expect(calculo.getUnidades()).toBe(Math.ceil(dosisTotalMg / presentacion));
  });

  test('debe retornar 0 si la fuerza de la presentación es cero', () => {
    const params = {
      fuerza_valor_requerida: 100,
      fuerza_unidad_requerida: 'mg/m2',
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
