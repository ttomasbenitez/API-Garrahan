/* global describe, test, expect */
import Paciente from '../../src/domain/paciente';

describe('Paciente', () => {
  test('deberia crear un paciente con todos los campos obligatorios', () => {
    const paciente = new Paciente('Juan', 'Pérez', 'P12345', '2020-05-21', 30, 'M', 101);
    expect(paciente.nombre).toBe('Juan');
    expect(paciente.id_hospitalario).toBe('P12345');
    expect(paciente.profesional_id).toBe(101);
  });

  test('debería fallar al crear un paciente sin id_hospitalario', () => {
    expect(() => {
      new Paciente('Juan', 'Pérez', null, '2020-05-21', 30, 'M', 101);
    }).toThrow('id_hospitalario es obligatorio');
  });

  test('debería fallar al crear un paciente sin profesional_id', () => {
    expect(() => {
      new Paciente('Juan', 'Pérez', 'P12345', '2020-05-21', 30, 'M', null);
    }).toThrow('profesional_id es obligatorio');
  });
});
