
/* global describe, test, expect */

import ViaAdministracion from '../../src/domain/droga/viaAdministracion';

describe('ViaAdministracion', () => {
  test('deberia crear una via con todos los campos obligatorios', () => {
    const via = new ViaAdministracion('Intravenosa', 'IV', 0);
    expect(via.nombre).toBe('Intravenosa');
    expect(via.codigo).toBe('IV');
    expect(via.via_id).toBe(0);
  });
});
