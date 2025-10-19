/* global describe, test, expect, jest, beforeEach */
import oracleDBInstance from '../../src/db/connection_pool.js';
import PresentacionDroga from '../../src/domain/droga/presentacionDroga.js';
import { RepositorioPresentacionDroga } from '../../src/persistance/repositorioPresentacionDroga.js';

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

describe(RepositorioPresentacionDroga, () => {
  let db;
  let repo;
  let presentacion;
  const presentaciones = [];

  const agregarPresentacion = async (cantidad = 1) => {
    for (let i = 0; i < cantidad; i++) {
      presentacion = new PresentacionDroga(1, 2, 'Activo', 500, 'mg');
      presentaciones.push(presentacion);
    }
    const ids = Array.from({ length: cantidad }, (v, i) => ({ id: [i] }));
    const connExecuteMock = jest.fn().mockResolvedValue({
      rowsAffected: cantidad,
      outBinds: ids,
    });
    db.withConnection.mockImplementation(async (fn) => {
      return await fn({ executeMany: connExecuteMock });
    });
    return { id: await repo.guardar(presentaciones), connExecuteMock };
  };

  beforeEach(() => {
    db = oracleDBInstance;
    repo = new RepositorioPresentacionDroga(db);
    db.execute.mockReset();
    db.withConnection.mockReset();
    db.execute.mockImplementation((sql, binds, opts) => {
      return Promise.resolve({ rows: [], sql, binds, opts });
    });
  });

  test('guardar presentacion de droga funciona correctamente devolviendo el id de la creación', async () => {
    const { connExecuteMock, id } = await agregarPresentacion(2);
    expect(id).toEqual([0, 1]);
    expect(db.withConnection).toHaveBeenCalledTimes(1);
    const [sql, binds, opts] = connExecuteMock.mock.calls[0];
    expect(sql).toMatch(/INSERT\s+INTO\s+presentacion_droga/i);
    expect(binds).toHaveLength(2);
    expect(binds[0]).toEqual({
      droga_id: 1,
      forma_farmaceutica_id: 2,
      estado: 'Activo',
      fuerza_valor: 500,
      fuerza_unidad: 'mg',
    });
    expect(opts).toMatchObject({ autoCommit: true });
  });

  test('obtener presentacion de droga por id funciona correctamente', async () => {
    const presentacionData = {
      DROGA_ID: 1,
      FORMA_FARMACEUTICA_ID: 2,
      ESTADO: 'Activo',
      FUERZA_VALOR: 500,
      FUERZA_UNIDAD: 'mg',
      PRESENTACION_ID: 1
    };
    db.execute.mockImplementation((sql, binds, opts) => {
      return Promise.resolve({ rows: [presentacionData], sql, binds, opts });
    });
    const resultado = await repo.obtener(1);
    expect(resultado).toBeInstanceOf(PresentacionDroga);
    expect(resultado).toMatchObject({
      droga_id: 1,
      forma_farmaceutica_id: 2,
      estado: 'Activo',
      fuerza_valor: 500,
      fuerza_unidad: 'mg',
      presentacion_id: 1,
    });
    expect(db.execute).toHaveBeenCalledTimes(1);
    const [sql, binds] = db.execute.mock.calls[0];
    expect(sql).toMatch(/SELECT\s+droga_id/i);
    expect(binds).toEqual([1]);
  });

  test('listar todas las presentaciones de droga devuelve un array de instancias', async () => {
    const rows = [
      { DROGA_ID: 1, FORMA_FARMACEUTICA_ID: 2, ESTADO: 'Activo', FUERZA_VALOR: 500, FUERZA_UNIDAD: 'mg', PRESENTACION_ID: 1 },
      { DROGA_ID: 1, FORMA_FARMACEUTICA_ID: 3, ESTADO: 'Activo', FUERZA_VALOR: 200, FUERZA_UNIDAD: 'mg', PRESENTACION_ID: 2 }
    ];
    db.execute.mockImplementation(() => Promise.resolve({ rows }));
    const resultado = await repo.listar();
    expect(Array.isArray(resultado)).toBe(true);
    expect(resultado).toHaveLength(2);
    expect(resultado[0]).toBeInstanceOf(PresentacionDroga);
    expect(resultado[0]).toMatchObject({ droga_id: 1, forma_farmaceutica_id: 2, estado: 'Activo', fuerza_valor: 500, fuerza_unidad: 'mg', presentacion_id: 1 });
    expect(resultado[1]).toMatchObject({ droga_id: 1, forma_farmaceutica_id: 3, estado: 'Activo', fuerza_valor: 200, fuerza_unidad: 'mg', presentacion_id: 2 });
  });

  test('eliminar una presentacion de droga existente retorna true si se elimina', async () => {
    db.execute.mockImplementation(() => Promise.resolve({ rowsAffected: 1 }));
    const eliminado = await repo.eliminar(2);
    expect(eliminado).toBe(true);
    expect(db.execute).toHaveBeenCalledWith(
      'DELETE FROM presentacion_droga WHERE presentacion_id = :id',
      [2]
    );
  });

  test('eliminar una presentacion de droga inexistente lanza error', async () => {
    db.execute.mockImplementation(() => Promise.resolve({ rowsAffected: 0 }));
    await expect(repo.eliminar(999)).rejects.toThrow();
  });
});
