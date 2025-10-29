/* global describe, test, expect */
import FormaFarmaceutica from '../../src/domain/droga/formaFarmaceutica';

describe('FormaFarmaceutica', () => {
  test('deberia crear una forma farmacéutica con todos los campos obligatorios', () => {
    const formaFarmaceutica = new FormaFarmaceutica('Comprimido', 'COM-100');
    expect(formaFarmaceutica.nombre).toBe('Comprimido');
    expect(formaFarmaceutica.codigo).toBe('COM-100');
  });
});
