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

  const agregarDroga = async () => {
    droga = new Droga('Ciclofosfamida', 'Quimioterapia', 'Oral', 50, 'mg/m2', 150, 'mg/m2');

    // Creamos el mock de la conexión y su método execute
    const connExecuteMock = jest.fn().mockResolvedValue({
      rowsAffected: 1,
      outBinds: { id: [2] }
    });
    db.withConnection.mockImplementation(async (fn) => {
      return await fn({ execute: connExecuteMock });
    });

    return {id: await repo.guardar(droga), connExecuteMock};
  };

  beforeEach(() => {
    db = oracleDB;
    repo = new RepositorioDroga(db);

    db.execute.mockReset();
    db.withConnection.mockReset();
  });

  test('guardar droga funciona correctamente devolviendo el id de la creación', async () => {
    const {connExecuteMock, id} = await agregarDroga();

    expect(id).toBe(2);
    expect(db.withConnection).toHaveBeenCalledTimes(1);


    const [sql, binds, opts] = connExecuteMock.mock.calls[0];
    expect(sql).toMatch(/INSERT\s+INTO\s+droga/i);
    expect(binds).toMatchObject({
      medicamento: droga.medicamento,
      presentacion: droga.presentacion,
      dosis: droga.dosis,
      dosis_unidad: droga.dosis_unidad,
      dosis_maxima: droga.dosis_maxima,
      dosis_maxima_unidad: droga.dosis_maxima_unidad
    });
    expect(opts).toMatchObject({ autoCommit: true });
  });
});
