/* global describe, test, expect, jest, beforeEach  */
import oracleDB from '../../src/db/connection_pool.js';
import ViaAdministracion from '../../src/domain/droga/viaAdministracion.js';
import { RepositorioViaAdministracion } from '../../src/persistance/repositorioViaAdministracion.js';

// Mock de 'oracledb' porque lo usás adentro del método con require('oracledb')
jest.mock('../../src/db/connection_pool.js', () => ({
  __esModule: true,
  default: {
    init: jest.fn(),
    getPool: jest.fn(),
    withConnection: jest.fn(),
    execute: jest.fn(),
    close: jest.fn(),
  }
}));


describe(RepositorioViaAdministracion, () => {
  let db;
  let repo;
  let via;

  const vias = [];
  const agregarVia = async (cantidad = 1) => {
    for(let i = 0; i < cantidad; i++) {
      via = new ViaAdministracion('Intravenosa', 'IV', i);
      vias.push(via);
    }
    const ids = Array.from({ length: cantidad }, (v, i) => ({ id: [i] }));
    // Creamos el mock de la conexión y su método execute
    const connExecuteMock = jest.fn().mockResolvedValue({
      rowsAffected: cantidad,
      outBinds: ids,
    });
    db.withConnection.mockImplementation(async (fn) => {
      return await fn({ executeMany: connExecuteMock });
    });

    return {id: await repo.guardar(vias), connExecuteMock};
  };

  beforeEach(() => {
    db = oracleDB;
    repo = new RepositorioViaAdministracion(db);

    db.execute.mockReset();
    db.withConnection.mockReset();
  });

  test('guardar una via funciona correctamente devolviendo el id de la creación', async () => {
    const {connExecuteMock, id} = await agregarVia();

    expect(id[0]).toBe(0);
    expect(db.withConnection).toHaveBeenCalledTimes(1);


    const [sql, binds, opts] = connExecuteMock.mock.calls[0];
    expect(sql).toMatch(/INSERT\s+INTO\s+via_administracion/i);
    expect(binds[0]).toMatchObject({
      nombre: via.nombre,
      codigo: via.codigo,
    });
    expect(opts).toMatchObject({ autoCommit: true });
  });

});
