/* global describe, test, expect */
import CalculoDroga from '../../src/domain/CalculoDroga.js';

// --- Constantes de Prueba ---
const PESO = 25; // kg
// SC: (25 * 4 + 7) / (25 + 90) = 107 / 115 ≈ 0.9304347826
const SC_CALCULADA = 107 / 115;
const CANTIDAD_DIAS = 7;
const FRECUENCIA_DIARIA = 1;
const FRECUENCIA_DIARIA_DOBLE = 2; // Para casos de dos tomas al día

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

describe('CalculoDroga - Dosis Diaria', () => {

  test('Dosis Diaria: mg/m2 (1 toma) y presentación en MG', () => {
    const fuerzaRequerida = 100;
    const params = {
      fuerza_valor_requerida: fuerzaRequerida,
      fuerza_unidad_requerida: 'mg/m2',
      cantidad_dias: CANTIDAD_DIAS,
      frecuencia_diaria: FRECUENCIA_DIARIA,
      peso: PESO,
      nueva_fuerza_valor: 500,
      nueva_fuerza_unidad: 'mg'
    };
    const calculo = new CalculoDroga(params);

    const dosisDiariaMg = fuerzaRequerida * SC_CALCULADA * FRECUENCIA_DIARIA;

    expect(calculo.getDosisDiaria()).toEqual({ valor: toFixedString(dosisDiariaMg, 2), unidad: 'mg' });
  });

  test('Dosis Diaria: mg/kg (2 tomas) y presentación en GR', () => {
    const fuerzaRequerida = 50;
    const presentacionGr = 1;
    const params = {
      fuerza_valor_requerida: fuerzaRequerida,
      fuerza_unidad_requerida: 'mg/kg',
      cantidad_dias: CANTIDAD_DIAS,
      frecuencia_diaria: FRECUENCIA_DIARIA_DOBLE,
      peso: 10,
      nueva_fuerza_valor: presentacionGr,
      nueva_fuerza_unidad: 'gr'
    };
    const calculo = new CalculoDroga(params);

    const dosisDiariaMg = fuerzaRequerida * 10 * FRECUENCIA_DIARIA_DOBLE;
    const dosisDiariaGr = dosisDiariaMg / 1000;

    expect(calculo.getDosisDiaria()).toEqual({ valor: toFixedString(dosisDiariaGr, 2), unidad: 'gr' });
  });

  test('Dosis Diaria: μg/kg (1 toma) y presentación en μg', () => {
    const fuerzaRequeridaμg = 50;
    const peso = 20;
    const presentacionμg = 100;

    const params = {
      fuerza_valor_requerida: fuerzaRequeridaμg,
      fuerza_unidad_requerida: 'μg/kg',
      cantidad_dias: CANTIDAD_DIAS,
      frecuencia_diaria: FRECUENCIA_DIARIA,
      peso: peso,
      nueva_fuerza_valor: presentacionμg,
      nueva_fuerza_unidad: 'μg'
    };
    const calculo = new CalculoDroga(params);

    const dosisDiariaMg = (fuerzaRequeridaμg / 1000) * peso * FRECUENCIA_DIARIA;
    const dosisDiariaμg = dosisDiariaMg * 1000;

    expect(calculo.getDosisDiaria()).toEqual({ valor: toFixedString(dosisDiariaμg, 2), unidad: 'μg' });
  });

  test('Dosis Diaria: maneja la nueva_fuerza_unidad vacía y devuelve en MG', () => {
    const fuerzaRequerida = 100;
    const params = {
      fuerza_valor_requerida: fuerzaRequerida,
      fuerza_unidad_requerida: 'mg/m2',
      cantidad_dias: CANTIDAD_DIAS,
      frecuencia_diaria: FRECUENCIA_DIARIA_DOBLE,
      peso: PESO,
      nueva_fuerza_valor: 500,
      nueva_fuerza_unidad: ''
    };
    const calculo = new CalculoDroga(params);

    const dosisDiariaMg = fuerzaRequerida * SC_CALCULADA * FRECUENCIA_DIARIA_DOBLE;

    expect(calculo.getDosisDiaria()).toEqual({ valor: toFixedString(dosisDiariaMg, 2), unidad: '' });
  });
});

describe('CalculoDroga - Vías de Administración IV', () => {

  test('Vía IV: debe calcular unidades día a día - Ejemplo 1.2mg/día x 4 días con ampollas de 1mg', () => {
    // Dosis diaria: 1.2 mg
    // Presentación: 1 mg por ampolla
    // Días: 4
    // Resultado esperado: 2 ampollas por día x 4 días = 8 ampollas
    const params = {
      fuerza_valor_requerida: 1.2,
      fuerza_unidad_requerida: 'mg',
      cantidad_dias: 4,
      frecuencia_diaria: 1,
      peso: 20,
      nueva_fuerza_valor: 1,
      nueva_fuerza_unidad: 'mg',
      via_codigo: 'IV'
    };
    const calculo = new CalculoDroga(params);

    // Cada día necesita 1.2 mg = 2 ampollas de 1mg (sobran 0.8mg que se tiran)
    // 4 días x 2 ampollas = 8 ampollas
    expect(calculo.getUnidades()).toBe(8);
  });

  test('Vía IV: debe calcular correctamente con dosis que se da 2 veces al día', () => {
    // Dosis: 50 mg/kg, 2 veces al día
    // Peso: 10 kg
    // Dosis por toma: 50 mg/kg x 10 kg = 500 mg
    // Dosis diaria total: 500 mg x 2 = 1000 mg
    // Presentación: 400 mg por vial
    // Unidades por día: ceil(1000 / 400) = 3 viales
    // Días: 3
    // Total: 3 viales x 3 días = 9 viales
    const params = {
      fuerza_valor_requerida: 50,
      fuerza_unidad_requerida: 'mg/kg',
      cantidad_dias: 3,
      frecuencia_diaria: 2,
      peso: 10,
      nueva_fuerza_valor: 400,
      nueva_fuerza_unidad: 'mg',
      via_codigo: 'IV'
    };
    const calculo = new CalculoDroga(params);

    expect(calculo.getUnidades()).toBe(9);
  });

  test('Vía IV: debe calcular correctamente con mg/m2', () => {
    // Dosis: 100 mg/m2
    // Peso: 25 kg → SC = 0.9304347826
    // Dosis diaria: 100 x 0.9304 x 1 = 93.04 mg
    // Presentación: 50 mg por ampolla
    // Unidades por día: ceil(93.04 / 50) = 2 ampollas
    // Días: 5
    // Total: 2 x 5 = 10 ampollas
    const params = {
      fuerza_valor_requerida: 100,
      fuerza_unidad_requerida: 'mg/m2',
      cantidad_dias: 5,
      frecuencia_diaria: 1,
      peso: 25,
      nueva_fuerza_valor: 50,
      nueva_fuerza_unidad: 'mg',
      via_codigo: 'IV'
    };
    const calculo = new CalculoDroga(params);

    expect(calculo.getUnidades()).toBe(10);
  });

  test('Vía IV: debe manejar decimales con redondeo hacia arriba por día', () => {
    // Dosis: 33.5 mg/día
    // Presentación: 10 mg por vial
    // Unidades por día: ceil(33.5 / 10) = 4 viales
    // Días: 7
    // Total: 4 x 7 = 28 viales
    const params = {
      fuerza_valor_requerida: 33.5,
      fuerza_unidad_requerida: 'mg',
      cantidad_dias: 7,
      frecuencia_diaria: 1,
      peso: 20,
      nueva_fuerza_valor: 10,
      nueva_fuerza_unidad: 'mg',
      via_codigo: 'IV'
    };
    const calculo = new CalculoDroga(params);

    expect(calculo.getUnidades()).toBe(28);
  });

  test('Vía VO: debe calcular acumulado cuando el código NO es IV', () => {
    // Mismo caso que el primer test de IV pero con código VO
    // Dosis total: 1.2 mg x 4 días = 4.8 mg
    // Presentación: 1 mg por comprimido
    // Total acumulado: ceil(4.8 / 1) = 5 comprimidos
    const params = {
      fuerza_valor_requerida: 1.2,
      fuerza_unidad_requerida: 'mg',
      cantidad_dias: 4,
      frecuencia_diaria: 1,
      peso: 20,
      nueva_fuerza_valor: 1,
      nueva_fuerza_unidad: 'mg',
      via_codigo: 'VO'
    };
    const calculo = new CalculoDroga(params);

    // Cálculo acumulado: 5 comprimidos (no 8 como en IV)
    expect(calculo.getUnidades()).toBe(5);
  });

  test('Sin código de vía: debe usar cálculo acumulado (comportamiento por defecto)', () => {
    // Sin especificar código, debe usar la lógica acumulada
    const params = {
      fuerza_valor_requerida: 1.2,
      fuerza_unidad_requerida: 'mg',
      cantidad_dias: 4,
      frecuencia_diaria: 1,
      peso: 20,
      nueva_fuerza_valor: 1,
      nueva_fuerza_unidad: 'mg'
      // via_codigo no especificado
    };
    const calculo = new CalculoDroga(params);

    expect(calculo.getUnidades()).toBe(5);
  });
});

describe('CalculoDroga - Validación VINCRISTINA', () => {

  test('VINCRISTINA: debe limitar la dosis diaria a máximo 2mg cuando se supera', () => {
    // Dosis que supera los 2mg
    const params = {
      fuerza_valor_requerida: 150, // mg/m2
      fuerza_unidad_requerida: 'mg/m2',
      cantidad_dias: CANTIDAD_DIAS,
      frecuencia_diaria: FRECUENCIA_DIARIA,
      peso: PESO,
      nueva_fuerza_valor: 1,
      nueva_fuerza_unidad: 'mg',
      nombre_droga: 'VINCRISTINA'
    };
    const calculo = new CalculoDroga(params);

    // Sin límite sería: 150 * 0.9304 * 1 = 139.56 mg/día
    // Con límite debe ser: 2.00 mg/día
    expect(calculo.getDosisDiaria()).toEqual({ valor: '2.00', unidad: 'mg' });
  });

  test('VINCRISTINA: no debe modificar la dosis si está por debajo de 2mg', () => {
    // Dosis menor a 2mg
    const params = {
      fuerza_valor_requerida: 1.5, // mg/kg
      fuerza_unidad_requerida: 'mg/kg',
      cantidad_dias: CANTIDAD_DIAS,
      frecuencia_diaria: FRECUENCIA_DIARIA,
      peso: 1, // 1kg para que sea 1.5mg
      nueva_fuerza_valor: 1,
      nueva_fuerza_unidad: 'mg',
      nombre_droga: 'VINCRISTINA'
    };
    const calculo = new CalculoDroga(params);

    // Dosis: 1.5 * 1 * 1 = 1.5 mg/día (no debe limitarse)
    expect(calculo.getDosisDiaria()).toEqual({ valor: '1.50', unidad: 'mg' });
  });

  test('VINCRISTINA: debe reconocer el nombre en minúsculas o con espacios', () => {
    const params = {
      fuerza_valor_requerida: 150,
      fuerza_unidad_requerida: 'mg/m2',
      cantidad_dias: CANTIDAD_DIAS,
      frecuencia_diaria: FRECUENCIA_DIARIA,
      peso: PESO,
      nueva_fuerza_valor: 1,
      nueva_fuerza_unidad: 'mg',
      nombre_droga: '  vincristina  ' // Con espacios y minúsculas
    };
    const calculo = new CalculoDroga(params);

    expect(calculo.getDosisDiaria()).toEqual({ valor: '2.00', unidad: 'mg' });
  });

  test('VINCRISTINA: debe aplicar el límite con frecuencia diaria múltiple', () => {
    // Si la frecuencia es 2 veces al día, la dosis total diaria sigue limitada a 2mg
    const params = {
      fuerza_valor_requerida: 75, // mg/m2
      fuerza_unidad_requerida: 'mg/m2',
      cantidad_dias: CANTIDAD_DIAS,
      frecuencia_diaria: FRECUENCIA_DIARIA_DOBLE,
      peso: PESO,
      nueva_fuerza_valor: 1,
      nueva_fuerza_unidad: 'mg',
      nombre_droga: 'VINCRISTINA'
    };
    const calculo = new CalculoDroga(params);

    // Sin límite sería: 75 * 0.9304 * 2 = 139.56 mg/día
    // Con límite debe ser: 2.00 mg/día
    expect(calculo.getDosisDiaria()).toEqual({ valor: '2.00', unidad: 'mg' });
  });

  test('Otras drogas: no deben tener límite de 2mg', () => {
    const params = {
      fuerza_valor_requerida: 150,
      fuerza_unidad_requerida: 'mg/m2',
      cantidad_dias: CANTIDAD_DIAS,
      frecuencia_diaria: FRECUENCIA_DIARIA,
      peso: PESO,
      nueva_fuerza_valor: 1,
      nueva_fuerza_unidad: 'mg',
      nombre_droga: 'DOXORRUBICINA'
    };
    const calculo = new CalculoDroga(params);

    // Dosis: 150 * 0.9304 * 1 = 139.56 mg/día (sin límite)
    const dosisEsperada = 150 * SC_CALCULADA * FRECUENCIA_DIARIA;
    expect(calculo.getDosisDiaria()).toEqual({
      valor: toFixedString(dosisEsperada, 2),
      unidad: 'mg'
    });
  });

  test('VINCRISTINA: debe limitar en diferentes unidades de presentación', () => {
    // Prueba con presentación en gramos
    const params = {
      fuerza_valor_requerida: 150,
      fuerza_unidad_requerida: 'mg/m2',
      cantidad_dias: CANTIDAD_DIAS,
      frecuencia_diaria: FRECUENCIA_DIARIA,
      peso: PESO,
      nueva_fuerza_valor: 0.001, // 0.001 gr = 1 mg
      nueva_fuerza_unidad: 'gr',
      nombre_droga: 'VINCRISTINA'
    };
    const calculo = new CalculoDroga(params);

    // 2mg limitado convertido a gramos = 0.002 gr
    expect(calculo.getDosisDiaria()).toEqual({ valor: '0.00', unidad: 'gr' });
  });
});
