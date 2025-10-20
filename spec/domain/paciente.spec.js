/* global describe, test, expect */
import Paciente from '../../src/domain/paciente';

describe('Paciente', () => {
  test('deberia crear un paciente con todos los campos obligatorios', () => {
    const paciente = new Paciente('Juan', 'Pérez', 'P12345', '2020-05-21', 30, 'M', 101);
    expect(paciente.nombre).toBe('Juan');
    expect(paciente.id_hospitalario).toBe('P12345');
    expect(paciente.profesional_id).toBe(101);
  });

});
