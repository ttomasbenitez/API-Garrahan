import Ciclo from '../../src/domain/protocolo/ciclo';

/* global describe, test, expect */
describe('Ciclo', () => {

  test('deberia crear un ciclo con todos los campos obligatorios', () => {
    const ciclo = new Ciclo(1, 1, 0, 5, false, 1);

    expect(ciclo.ciclo_id).toBe(1);
    expect(ciclo.protocolo_id).toBe(1);
    expect(ciclo.regimen).toBe(0);
    expect(ciclo.duracion_semanas).toBe(5);
    expect(ciclo.ciclo_final).toBe(false);
    expect(ciclo.repeticiones).toBe(1);
  });

});
