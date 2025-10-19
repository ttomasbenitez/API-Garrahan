/* global describe, test, expect, jest, beforeEach */
import oracleDBInstance from '../../src/db/connection_pool';
import PresentacionDrogaVia from '../../src/domain/droga/presentacionDrogaVia';
import { RepositorioPresentacionDrogaVia } from '../../src/persistance/repositorioPresentacionDrogaVia';

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

describe('RepositorioPresentacionDrogaVia', () => {
  let db;
  let repo;

  beforeEach(() => {
    db = oracleDBInstance;
    repo = new RepositorioPresentacionDrogaVia(db);
    db.execute.mockReset();
    db.withConnection.mockReset();
  });

  test('guardar presentación droga vía funciona correctamente', async () => {
    const presentacionVia = new PresentacionDrogaVia(1, 2, '1');

    const connExecuteMock = jest.fn().mockResolvedValue({
      rowsAffected: 1,
    });

    db.withConnection.mockImplementation(async (fn) => {
      return await fn({ executeMany: connExecuteMock });
    });

    const resultado = await repo.guardar([presentacionVia]);

    expect(resultado).toBe(true);
    expect(db.withConnection).toHaveBeenCalledTimes(1);

    const [sql, binds, opts] = connExecuteMock.mock.calls[0];
    expect(sql).toMatch(/INSERT\s+INTO\s+presentacion_droga_via/i);
    expect(binds).toHaveLength(1);
    expect(binds[0]).toEqual({
      via_id: 1,
      presentacion_id: 2,
      es_default: '1',
    });
    expect(opts.autoCommit).toBe(true);
  });

  test('obtener presentación droga vía por via_id y presentacion_id funciona correctamente', async () => {
    const mockData = { VIA_ID: 1, PRESENTACION_ID: 2, ES_DEFAULT: '1' };
    db.execute.mockResolvedValue({ rows: [mockData] });

    const resultado = await repo.obtener(1, 2);

    expect(resultado).toBeInstanceOf(PresentacionDrogaVia);
    expect(resultado.via_id).toBe(1);
    expect(resultado.presentacion_id).toBe(2);
    expect(resultado.es_default).toBe('1');
    expect(db.execute).toHaveBeenCalledTimes(1);
  });

  test('obtener devuelve null si no existe la presentación droga vía', async () => {
    db.execute.mockResolvedValue({ rows: [] });

    const resultado = await repo.obtener(999, 888);

    expect(resultado).toBeNull();
    expect(db.execute).toHaveBeenCalledTimes(1);
  });

  test('listar por presentacion devuelve todas las vías asociadas', async () => {
    const mockRows = [
      { VIA_ID: 1, PRESENTACION_ID: 2, ES_DEFAULT: '1', VIA_NOMBRE: 'Oral' },
      { VIA_ID: 3, PRESENTACION_ID: 2, ES_DEFAULT: '0', VIA_NOMBRE: 'Intravenosa' }
    ];
    db.execute.mockResolvedValue({ rows: mockRows });

    const resultado = await repo.listarPorPresentacion(2);

    expect(Array.isArray(resultado)).toBe(true);
    expect(resultado).toHaveLength(2);
    expect(resultado[0]).toMatchObject({
      via_id: 1,
      presentacion_id: 2,
      es_default: '1',
      via_nombre: 'Oral'
    });
    expect(resultado[1]).toMatchObject({
      via_id: 3,
      presentacion_id: 2,
      es_default: '0',
      via_nombre: 'Intravenosa'
    });
  });

  test('eliminar presentación droga vía funciona correctamente', async () => {
    db.execute.mockResolvedValue({ rowsAffected: 1 });

    const resultado = await repo.eliminar(1, 2);

    expect(resultado).toBe(true);
    expect(db.execute).toHaveBeenCalledWith(
      'DELETE FROM presentacion_droga_via WHERE via_id = :via_id AND presentacion_id = :presentacion_id',
      [1, 2]
    );
  });

  test('eliminar lanza error si no existe la presentación droga vía', async () => {
    db.execute.mockResolvedValue({ rowsAffected: 0 });

    await expect(repo.eliminar(999, 888)).rejects.toThrow('Error al eliminar la presentación droga vía');
  });
});
