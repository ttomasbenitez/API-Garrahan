/* global describe, test, expect, jest, beforeEach  */
import oracleDB from '../../src/db/connection_pool.js';
import AdministracionMedicacion from '../../src/domain/protocolo/administracionMedicacion.js';
import { RepositorioAdminisitracionMedicacion } from '../../src/persistance/repositorioAdministracionMedicacion.js';

// Mock de 'oracledb'
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

describe(RepositorioAdminisitracionMedicacion, () => {
  let db;
  let repo;
  let administracion_medicacion;
  const administraciones_medicacion = [];

  const agregarAdministraciones = async (cantidad = 1) => {
    for (let i = 0; i < cantidad; i++) {
      administracion_medicacion = new AdministracionMedicacion(1, 1, 0, 10, 13, 500, 'mg', 2, 0, 1, i);
      administraciones_medicacion.push(administracion_medicacion);
    }

    // IDs como objetos para OUT_FORMAT_OBJECT
    const ids = Array.from({ length: cantidad }, (v, i) => ({ id: [i] }));

    const connExecuteMock = jest.fn().mockResolvedValue({
      rowsAffected: cantidad,
      outBinds: ids,
    });

    db.withConnection.mockImplementation(async (fn) => {
      return await fn({ executeMany: connExecuteMock });
    });

    return { id: await repo.guardar(administraciones_medicacion), connExecuteMock };
  };

  beforeEach(() => {
    db = oracleDB;
    repo = new RepositorioAdminisitracionMedicacion(db);

    db.execute.mockReset();
    db.withConnection.mockReset();
  });

  test('guardar una administracion funciona correctamente devolviendo el id de la creación', async () => {
    const { connExecuteMock, id } = await agregarAdministraciones();

    expect(id[0]).toBe(0);
    expect(db.withConnection).toHaveBeenCalledTimes(1);

    const [sql, binds, opts] = connExecuteMock.mock.calls[0];
    expect(sql).toMatch(/INSERT\s+INTO\s+administracion_medicacion/i);
    expect(binds[0]).toMatchObject({
      protocolo_id: administracion_medicacion.protocolo_id,
      ciclo_id: administracion_medicacion.ciclo_id,
      fuerza_valor: administracion_medicacion.fuerza_valor,
      droga_id: administracion_medicacion.droga_id,
      fuerza_unidad: administracion_medicacion.fuerza_unidad,
    });
    expect(opts).toMatchObject({ autoCommit: true });
  });

});
