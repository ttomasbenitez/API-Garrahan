/* global describe, test, expect, jest, beforeEach  */
import Protocolo from '../../src/domain/protocolo';
import { RepositorioProtocolo } from '../../src/persistance/repositorioProtocolo';
// Mock de 'oracledb' porque lo usás adentro del método con require('oracledb')
jest.mock('oracledb', () => ({
  BIND_OUT: 3003,  // valores simbólicos; solo tienen que existir
  NUMBER: 2010
}));

describe('RepositorioProtocolo.guardar', () => {
  let connection;
  let repo;

  beforeEach(() => {
    connection = { execute: jest.fn() };
    repo = new RepositorioProtocolo(connection);
  });

  test('inserta y devuelve el id cuando todo va bien', async () => {
    const protocolo = new Protocolo('Osteosarcoma GBTO 2006 - No metastásico', 'Osteosarcoma', 'primera linea');

    connection.execute.mockResolvedValue({
      rowsAffected: 1,
      outBinds: { id: [123] }
    });

    const id = await repo.guardar(protocolo);

    expect(id).toBe(123);
    expect(connection.execute).toHaveBeenCalledTimes(1);

    const [sql, binds, opts] = connection.execute.mock.calls[0];
    expect(sql).toMatch(/INSERT\s+INTO\s+protocolo/i);
    expect(binds).toMatchObject({
      nombre: protocolo.nombre,
      enfermedad: protocolo.enfermedad,
      linea: protocolo.linea
      // el bind OUT 'id' lo provee el mock de oracledb
    });
    expect(opts).toMatchObject({ autoCommit: true });
  });
});
