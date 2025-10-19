/* global describe, test, expect */
import PresentacionDrogaVia from '../../src/domain/droga/presentacionDrogaVia';

describe('PresentacionDrogaVia', () => {
  test('debería crear una presentación droga vía con todos los campos', () => {
    const presentacionVia = new PresentacionDrogaVia(1, 2, '1');
    expect(presentacionVia.via_id).toBe(1);
    expect(presentacionVia.presentacion_id).toBe(2);
    expect(presentacionVia.es_default).toBe('1');
  });

  test('debería crear una presentación droga vía con es_default por defecto en "0"', () => {
    const presentacionVia = new PresentacionDrogaVia(1, 2);
    expect(presentacionVia.via_id).toBe(1);
    expect(presentacionVia.presentacion_id).toBe(2);
    expect(presentacionVia.es_default).toBe('0');
  });
});
