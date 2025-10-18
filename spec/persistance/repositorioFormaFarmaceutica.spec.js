/* global describe, test, expect, jest, beforeEach  */
import oracleDBInstance from '../../src/db/connection_pool';
import FormaFarmaceutica from '../../src/domain/droga/formaFarmaceutica';
import { RepositorioFormaFarmaceutica } from '../../src/persistance/repositorioFormaFarmaceutica';

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


describe(RepositorioFormaFarmaceutica, () => {
  let db;
  let repo;
  let formaFarmaceutica;
  const formasFarmaceuticas = [];

  const agregarFormaFarmaceutica = async (cantidad = 1) => {
    for (let i = 0; i < cantidad; i++) {
      formaFarmaceutica = new FormaFarmaceutica(`Nombre ${i + 1}`, `Código ${i + 1}`);
      formasFarmaceuticas.push(formaFarmaceutica);
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

    return { id: await repo.guardar(formasFarmaceuticas), connExecuteMock };
  };

  beforeEach(() => {
    db = oracleDBInstance;
    repo = new RepositorioFormaFarmaceutica(db);

    db.execute.mockReset();
    db.withConnection.mockReset();
    db.execute.mockImplementation((sql, binds, opts) => {
      return Promise.resolve({ rows: [], sql, binds, opts });
    });
  });

  test('guardar forma farmacéutica funciona correctamente devolviendo el id de la creación', async () => {
    const { connExecuteMock, id } = await agregarFormaFarmaceutica(3);

    expect(id).toEqual([0, 1, 2]);
    expect(db.withConnection).toHaveBeenCalledTimes(1);

    const [sql, binds, opts] = connExecuteMock.mock.calls[0];
    expect(sql).toMatch(/INSERT\s+INTO\s+forma_farmaceutica/i);
    expect(binds).toHaveLength(3);
    expect(binds[0]).toEqual({
      nombre: 'Nombre 1',
      codigo: 'Código 1',
    });
    expect(opts).toMatchObject({
      autoCommit: true,
      bindDefs: {
        id: expect.any(Object),
        nombre: expect.any(Object),
        codigo: expect.any(Object),
      },
    });
  });

  // test('obtener forma farmacéutica por id funciona correctamente devolviendo la forma farmacéutica', async () => {
  //   const formaFarmaceuticaData = { NOMBRE: 'Nombre 1', CODIGO: 'Código 1', FORMA_FARMACEUTICA_ID: 1 };
  //   db.execute.mockImplementation((sql, binds, opts) => {
  //     return Promise.resolve({ rows: [formaFarmaceuticaData], sql, binds, opts });
  //   });

  //   const resultado = await repo.obtener(1);
  //   expect(resultado).toBeInstanceOf(FormaFarmaceutica);
  //   expect(resultado).toMatchObject({
  //     nombre: 'Nombre 1',
  //     codigo: 'Código 1',
  //     forma_farmaceutica_id: 1,
  //   });
  //   expect(db.execute).toHaveBeenCalledTimes(1);

  //   const [sql, binds] = db.execute.mock.calls[0];
  //   expect(sql).toMatch(/SELECT\s+nombre,\s+codigo,\s+forma_farmaceutica_id\s+FROM\s+forma_farmaceutica/i);
  //   expect(binds).toEqual([1]);
  // });

  // test('obtener forma farmacéutica por id devuelve null si no existe la forma farmacéutica', async () => {
  //   db.execute.mockImplementation((sql, binds, opts) => {
  //     return Promise.resolve({ rows: [], sql, binds, opts });
  //   });

  //   const resultado = await repo.obtener(999);
  //   expect(resultado).toBeNull();
  //   expect(db.execute).toHaveBeenCalledTimes(1);

  //   const [sql, binds] = db.execute.mock.calls[0];
  //   expect(sql).toMatch(/SELECT\s+nombre,\s+codigo,\s+forma_farmaceutica_id\s+FROM\s+forma_farmaceutica/i);
  //   expect(binds).toEqual([999]);
  // });

  // test('listar todas las formas farmacéuticas devuelve un array de instancias', async () => {
  //   const rows = [
  //     { NOMBRE: 'Comprimido', CODIGO: 'TAB', FORMA_FARMACEUTICA_ID: 1 },
  //     { NOMBRE: 'Solución inyectable', CODIGO: 'SOL-INY', FORMA_FARMACEUTICA_ID: 2 }
  //   ];
  //   db.execute.mockImplementation(() => Promise.resolve({ rows }));
  //   const resultado = await repo.listar();
  //   expect(Array.isArray(resultado)).toBe(true);
  //   expect(resultado).toHaveLength(2);
  //   expect(resultado[0]).toBeInstanceOf(FormaFarmaceutica);
  //   expect(resultado[0]).toMatchObject({ nombre: 'Comprimido', codigo: 'TAB', forma_farmaceutica_id: 1 });
  //   expect(resultado[1]).toMatchObject({ nombre: 'Solución inyectable', codigo: 'SOL-INY', forma_farmaceutica_id: 2 });
  // });

  // test('actualizar una forma farmacéutica existente retorna true si se actualiza', async () => {
  //   db.execute.mockImplementation(() => Promise.resolve({ rowsAffected: 1 }));
  //   const actualizado = await repo.actualizar(2, { nombre: 'Solución inyectable estéril', codigo: 'SOL-INY-EST' });
  //   expect(actualizado).toBe(true);
  //   expect(db.execute).toHaveBeenCalledWith(
  //     'UPDATE forma_farmaceutica SET nombre = :nombre, codigo = :codigo WHERE forma_farmaceutica_id = :id',
  //     ['Solución inyectable estéril', 'SOL-INY-EST', 2]
  //   );
  // });

  // test('actualizar una forma farmacéutica inexistente retorna false', async () => {
  //   db.execute.mockImplementation(() => Promise.resolve({ rowsAffected: 0 }));
  //   const actualizado = await repo.actualizar(999, { nombre: 'X', codigo: 'Y' });
  //   expect(actualizado).toBe(false);
  // });
});
