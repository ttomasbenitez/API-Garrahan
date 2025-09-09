
/* global describe, test, expect */
import Droga from '../../src/domain/droga';
describe('Droga', () => {
  test('deberia crear una droga con todos los campos obligatorios', () => {
    const droga = new Droga('CISPLATINO', 'FRASCO AMPOLLA', 10, 'mg', 10, 'mg');
    expect(droga.medicamento).toBe('CISPLATINO');
    expect(droga.presentacion).toBe('FRASCO AMPOLLA');
    expect(droga.dosis).toBe(10);
    expect(droga.dosis_unidad).toBe('mg');
    expect(droga.dosis_maxima).toBe(10);
    expect(droga.dosis_maxima_unidad).toBe('mg');
  });
});
