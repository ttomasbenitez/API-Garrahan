/* global describe, test, expect */
import Paciente from '../../src/domain/paciente';

describe('Paciente', () => {
  test('deberia crear un paciente con todos los campos obligatorios', () => {
    const paciente = new Paciente({
      nombre: 'Juan',
      apellido: 'Pérez',
      id_hospitalario: 'P12345',
      fecha_nacimiento: '2020-05-21',
      peso: 30,
      altura: 70,
      sexo: 'M'
    });

    expect(paciente.nombre).toBe('Juan');
    expect(paciente.id_hospitalario).toBe('P12345');
  });
});
