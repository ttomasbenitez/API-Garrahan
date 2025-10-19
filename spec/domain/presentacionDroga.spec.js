/* global describe, test, expect */
import PresentacionDroga from '../../src/domain/droga/presentacionDroga.js';

describe('PresentacionDroga', () => {
  test('debería crear una presentación de droga con todos los campos obligatorios', () => {
    const presentacion = new PresentacionDroga(1, 2, 'Activo', 500, 'mg', 10);
    expect(presentacion.droga_id).toBe(1);
    expect(presentacion.forma_farmaceutica_id).toBe(2);
    expect(presentacion.estado).toBe('Activo');
    expect(presentacion.fuerza_valor).toBe(500);
    expect(presentacion.fuerza_unidad).toBe('mg');
    expect(presentacion.presentacion_id).toBe(10);
  });

  test('debería permitir valores nulos en los campos opcionales', () => {
    const presentacion = new PresentacionDroga(1, 2);
    expect(presentacion.droga_id).toBe(1);
    expect(presentacion.forma_farmaceutica_id).toBe(2);
    expect(presentacion.estado).toBeNull();
    expect(presentacion.fuerza_valor).toBeNull();
    expect(presentacion.fuerza_unidad).toBeNull();
    expect(presentacion.presentacion_id).toBeNull();
  });
});
