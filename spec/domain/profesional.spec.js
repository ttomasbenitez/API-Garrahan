/* global describe, test, expect */
import Profesional from '../../src/domain/profesional';

describe('Profesional', () => {
  test('deberia crear un profesional con todos los campos obligatorios', () => {
    const profesional = new Profesional('Walter', 'Perez', 20981812, 'MP12345', 'Oncología', 101);
    expect(profesional.profesional_id).toBe(101);
    expect(profesional.dni).toBe(20981812);
    expect(profesional.nombre).toBe('Walter');
    expect(profesional.apellido).toBe('Perez');
  });

  test('debería fallar al crear un profesional sin nombre', () => {
    expect(() => {
      new Profesional(null, 'Perez', 20981812, 'MP12345', 'Oncología', 101);
    }).toThrow('Faltan datos obligatorios');
  });

  test('debería fallar al crear un profesional sin apellido', () => {
    expect(() => {
      new Profesional('Walter', null, 20981812, 'MP12345', 'Oncología', 101);
    }).toThrow('Faltan datos obligatorios');
  });

  test('debería fallar al crear un profesional sin dni', () => {
    expect(() => {
      new Profesional('Walter','Perez', null, 'MP12345', 'Oncología', 101);
    }).toThrow('Faltan datos obligatorios');
  });

});
