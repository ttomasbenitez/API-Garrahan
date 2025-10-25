/* global describe, test, expect */

import RecetaPaciente from '../../src/domain/receta/recetaPaciente.js';

describe('RecetaPaciente', () => {
  test('debería crear correctamente una receta para cierto paciente con los campos obligatorios', () => {
    const rp = new RecetaPaciente(1, 1, 0, 120, 20, 'activo', 70, 175, 1.8, new Date('2024-06-15'), 50);
    expect(rp.protocolo_id).toBe(1);
    expect(rp.ciclo_id).toBe(1);
    expect(rp.regimen).toBe(0);
    expect(rp.paciente_id).toBe(120);
    expect(rp.profesional_id).toBe(20);
    expect(rp.fecha_receta).toEqual(new Date('2024-06-15'));
    expect(rp.estado).toBe('activo');
    expect(rp.peso).toBe(70);
    expect(rp.talla).toBe(175);
    expect(rp.superficie_corporal).toBe(1.8);
    expect(rp.id).toBe(50);
  });

});
