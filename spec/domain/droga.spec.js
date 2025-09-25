
/* global describe, test, expect */
import Droga from '../../src/domain/droga';
describe('Droga', () => {
  test('deberia crear una droga con todos los campos obligatorios', () => {
    const droga = new Droga('CISPLATINO', 'FRASCO AMPOLLA', 10, 'mg', 10, 'mg');
    expect(droga.nombre_generico).toBe('CISPLATINO');
    expect(droga.codigo_farmacia).toBe('FRASCO AMPOLLA');
  });
});
