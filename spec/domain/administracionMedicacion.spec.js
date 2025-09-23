/* global describe, test, expect */

import AdministracionMedicacion from '../../src/domain/protocolo/administracionMedicacion.js';

describe('AdministracionMedicacion', () => {

  test('deberia crear una administracion de medicacion con todos los campos obligatorios', () => {
    const admin = new AdministracionMedicacion(1, 10, 'mg/ml', '1,5', 0, 1);
    expect(admin.id_droga).toBe(1);
    expect(admin.dosis).toBe(10);
    expect(admin.dosis_unidad).toBe('mg/ml');
    expect(admin.frecuencia).toBe('1,5');
    expect(admin.administracion_diaria).toBe(0);
    expect(admin.frecuencia_diaria).toBe(1);
  });
});
