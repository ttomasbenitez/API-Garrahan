import Ciclo from '../../src/domain/ciclo';

/* global describe, test, expect */
describe('Ciclo', () => {

  test('deberia crear un ciclo con todos los campos obligatorios', () => {
    const ciclo = new Ciclo(1,1,0,5,false, 1);

    expect(ciclo.id).toBe(1);
    expect(ciclo.protocolo_id).toBe(1);
    expect(ciclo.regimen).toBe(0);
    expect(ciclo.duracion_semanas).toBe(5);
    expect(ciclo.ciclo_final).toBe(false);
    expect(ciclo.repeticiones).toBe(1);
  });

  test('deberia obtener un ciclo con todos los campos a partir de un row', () => {
    const row = [
      1,
      1,
      0,
      5,
      0,
      1,
    ];
    const ciclo = Ciclo.fromRow(row);
    expect(ciclo.id).toBe(1);
    expect(ciclo.protocolo_id).toBe(1);
    expect(ciclo.regimen).toBe(0);
    expect(ciclo.duracion_semanas).toBe(5);
    expect(ciclo.ciclo_final).toBe(false);
    expect(ciclo.repeticiones).toBe(1);
  });
});
