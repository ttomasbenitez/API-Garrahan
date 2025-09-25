/* global describe, test, expect, jest, beforeEach  */
import oracleDB from '../../src/db/connection_pool.js';
import Droga from '../../src/domain/droga';
import { RepositorioDroga } from '../../src/persistance/repositorioDroga.js';

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


describe(RepositorioDroga, () => {
  let db;
  let repo;
  let droga;
  const drogas = [];
  const agregarDroga = async (cantidad = 1) => {
    for(let i = 0; i < cantidad; i++) {
      droga = new Droga('Ciclofosfamida', 'Oral', 50 + i, 'mg/m2', 150 + i, 'mg/m2');
      drogas.push(droga);
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

    return {id: await repo.guardar(drogas), connExecuteMock};
  };

  beforeEach(() => {
    db = oracleDB;
    repo = new RepositorioDroga(db);

    db.execute.mockReset();
    db.withConnection.mockReset();
  });

  test('guardar droga funciona correctamente devolviendo el id de la creación', async () => {
    const {connExecuteMock, id} = await agregarDroga();

    expect(id[0]).toBe(0);
    expect(db.withConnection).toHaveBeenCalledTimes(1);


    const [sql, binds, opts] = connExecuteMock.mock.calls[0];
    expect(sql).toMatch(/INSERT\s+INTO\s+droga/i);
    expect(binds[0]).toMatchObject({
      nombre_generico: droga.nombre_generico,
      codigo_farmacia: droga.codigo_farmacia,
    });
    expect(opts).toMatchObject({ autoCommit: true });
  });

  test('puede guardar varias drogas en simultaneo', async () => {
    const {connExecuteMock, id} = await agregarDroga(2);
    expect(id[0]).toBe(0);
    expect(id[1]).toBe(1);
    expect(db.withConnection).toHaveBeenCalledTimes(1);

    const [sql, binds, opts] = connExecuteMock.mock.calls[0];
    expect(sql).toMatch(/INSERT\s+INTO\s+droga/i);
    expect(binds[0]).toMatchObject({
      nombre_generico: drogas[0].nombre_generico,
      codigo_farmacia: drogas[0].codigo_farmacia,
    });
    expect(binds[1]).toMatchObject({
      nombre_generico: drogas[1].nombre_generico,
      codigo_farmacia: drogas[1].codigo_farmacia,
    });
    expect(opts).toMatchObject({ autoCommit: true });
  });

  test('puedo obtener una droga por su id', async () => {
    await agregarDroga();
    const drogaId = 0;
    const expectedDroga = [
      droga.nombre_generico,
      droga.codigo_farmacia,
      drogaId
    ];
    // Creamos el mock de la conexión y su método execute
    db.execute.mockResolvedValue({
      rows: [expectedDroga]
    });

    const drogaObtenida = await repo.obtener(0);

    expect(db.execute).toHaveBeenCalledTimes(1);
    const [sql] = db.execute.mock.calls[0];
    expect(sql).toMatch(/SELECT\s+/i);
    expect(sql).toMatch(/FROM\s+droga/i);

    expect(drogaObtenida).toBeInstanceOf(Droga);
    expect(drogaObtenida).toMatchObject({
      nombre_generico: expectedDroga[0],
      codigo_farmacia: expectedDroga[1],
      droga_id: expectedDroga[2]
    });
  });
});
