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
      medicamento: droga.medicamento,
      presentacion: droga.presentacion,
      dosis: droga.dosis,
      dosis_unidad: droga.dosis_unidad,
      dosis_maxima: droga.dosis_maxima,
      dosis_maxima_unidad: droga.dosis_maxima_unidad
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
      medicamento: drogas[0].medicamento,
      presentacion: drogas[0].presentacion,
      dosis: drogas[0].dosis,
      dosis_unidad: drogas[0].dosis_unidad,
      dosis_maxima: drogas[0].dosis_maxima,
      dosis_maxima_unidad: drogas[0].dosis_maxima_unidad
    });
    expect(binds[1]).toMatchObject({
      medicamento: drogas[1].medicamento,
      presentacion: drogas[1].presentacion,
      dosis: drogas[1].dosis,
      dosis_unidad: drogas[1].dosis_unidad,
      dosis_maxima: drogas[1].dosis_maxima,
      dosis_maxima_unidad: drogas[1].dosis_maxima_unidad
    });
    expect(opts).toMatchObject({ autoCommit: true });
  });

  test('puedo obtener una droga por su id', async () => {
    await agregarDroga();
    const drogaId = 0;
    const expectedDroga = [
      droga.medicamento,
      droga.presentacion,
      droga.dosis,
      droga.dosis_unidad,
      droga.dosis_maxima,
      droga.dosis_maxima_unidad,
      null,
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
      medicamento: expectedDroga[0],
      presentacion: expectedDroga[1],
      dosis: expectedDroga[2],
      dosis_unidad: expectedDroga[3],
      dosis_maxima: expectedDroga[4],
      dosis_maxima_unidad: expectedDroga[5],
      id_droga: expectedDroga[7]
    });
  });
});
