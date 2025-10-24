/* global describe, test, expect */

import AdministracionMedicacion from '../../src/domain/protocolo/administracionMedicacion.js';

describe('AdministracionMedicacion', () => {

  test('deberia crear una administracion de medicacion con todos los campos obligatorios', () => {
    const admin = new AdministracionMedicacion(1, 1, 0, 10, 13, 500, 'mg', 2, 0, 1, 1);
    expect(admin.protocolo_id).toBe(1);
    expect(admin.ciclo_id).toBe(1);
    expect(admin.regimen).toBe(0);
    expect(admin.droga_id).toBe(10);
    expect(admin.via_id).toBe(13);
    expect(admin.fuerza_valor).toBe(500);
    expect(admin.fuerza_unidad).toBe('mg');
    expect(admin.cantidad_dias).toBe(2);
    expect(admin.administracion_diaria).toBe(0);
    expect(admin.frecuencia_diaria).toBe(1);
    expect(admin.id).toBe(1);
  });
});
