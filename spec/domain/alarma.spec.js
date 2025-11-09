/* global describe, test, expect */
import Alarma from '../../src/domain/alarma/alarma';

describe('Alarma', () => {
  test('deberia crear una alarma con todos los campos', () => {
    const fecha = new Date('2025-10-20');
    const alarma = new Alarma(1, 123, fecha, 18);

    expect(alarma.alarma_id).toBe(1);
    expect(alarma.paciente_id).toBe(123);
    expect(alarma.fecha_ultima_receta).toBe(fecha);
    expect(alarma.dias_transcurridos).toBe(18);
  });

  test('deberia crear una alarma con valores null por defecto', () => {
    const alarma = new Alarma();

    expect(alarma.alarma_id).toBeNull();
    expect(alarma.paciente_id).toBeNull();
    expect(alarma.fecha_ultima_receta).toBeNull();
    expect(alarma.dias_transcurridos).toBeNull();
  });

  test('deberia crear una alarma sin alarma_id', () => {
    const fecha = new Date('2025-10-20');
    const alarma = new Alarma(null, 456, fecha, 25);

    expect(alarma.alarma_id).toBeNull();
    expect(alarma.paciente_id).toBe(456);
    expect(alarma.fecha_ultima_receta).toBe(fecha);
    expect(alarma.dias_transcurridos).toBe(25);
  });
});
