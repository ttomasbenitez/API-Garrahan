/* global describe, test, expect, jest, beforeEach  */
import oracleDB from '../../src/db/connection_pool.js';
import Ciclo from '../../src/domain/ciclo/index.js';
import Protocolo from '../../src/domain/protocolo';
import { RepositorioProtocolo } from '../../src/persistance/repositorioProtocolo';
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


describe(RepositorioProtocolo, () => {
  let db;
  let repo;
  let protocolo;
  let connExecuteMock;

  const agregarProtocolo = async () => {
    protocolo = new Protocolo('Osteosarcoma GBTO 2006 - No metastásico', 'Osteosarcoma', 'primera linea', 1);

    // Creamos el mock de la conexión y su método execute
    connExecuteMock = jest.fn().mockResolvedValue({
      rowsAffected: 1,
      outBinds: { id: [123] }
    });
    db.withConnection.mockImplementation(async (fn) => {
      return await fn({ execute: connExecuteMock });
    });


    return await repo.guardar(protocolo);
  };

  beforeEach(() => {
    db = oracleDB; // <--- agrega esto
    repo = new RepositorioProtocolo(db); // <--- agrega esto

    db.execute.mockReset();
    db.withConnection.mockReset();
  });

  test('guardar protocolo funciona correctamente devolviendo el id de la creación', async () => {
    const id = await agregarProtocolo();

    expect(id).toBe(123);
    expect(db.withConnection).toHaveBeenCalledTimes(1);


    const [sql, binds, opts] = connExecuteMock.mock.calls[0];
    expect(sql).toMatch(/INSERT\s+INTO\s+protocolo/i);
    expect(binds).toMatchObject({
      nombre: protocolo.nombre,
      enfermedad: protocolo.enfermedad,
      linea: protocolo.linea
      // el bind OUT 'id' lo provee el mock de oracledb
    });
    expect(opts).toMatchObject({ autoCommit: true });
  });

  test('guardar protocolo lanza error si no se crea', async () => {
    const protocolo = new Protocolo('Osteosarcoma GBTO 2006 - No metastásico', 'Osteosarcoma', 'primera linea', 3);

    db.withConnection.mockImplementation(async (fn) => {
      return await fn({ execute: jest.fn().mockResolvedValue({
        rowsAffected: 0,
        outBinds: { id: [] }
      }) });
    });

    await expect(repo.guardar(protocolo)).rejects.toThrow('Error al crear el protocolo');
  });

  test('obtener protocolo funciona correctamente devolviendo el objeto Protocolo', async () => {
    const row = [
      123,
      'Osteosarcoma GBTO 2006 - No metastásico',
      'Osteosarcoma',
      'primera linea'
    ];

    db.execute.mockResolvedValue({
      rows: [row]
    });

    const protocolo = await repo.obtener(123);

    expect(protocolo).toBeInstanceOf(Protocolo);
    expect(protocolo).toMatchObject({
      nombre: row[1],
      enfermedad: row[2],
      linea: row[3],
      protocolo_id: row[0]
    });

    expect(db.execute).toHaveBeenCalledTimes(1);
    const [sql, binds] = db.execute.mock.calls[0];
    expect(sql).toMatch(/SELECT\s+protocolo_id,\s+nombre,\s+enfermedad,\s+linea\s+FROM\s+protocolo/i);
    expect(binds).toEqual([123]);
  });

  test('obtener protocolo lanza error si no se encuentra el id', async () => {
    db.execute.mockResolvedValue({
      rows: []
    });

    await expect(repo.obtener(999)).rejects.toThrow('Protocolo no encontrado');
  });

  test('agregar ciclo al protocolo funciona correctamente', async () => {
    const id = await agregarProtocolo();
    const ciclo = new Ciclo(id, 1, 0, 5, false);

    // Creamos el mock de la conexión y su método execute
    const connExecuteMock = jest.fn().mockResolvedValue({
      rowsAffected: 1,
      outBinds: { id: 1 }
    });

    db.withConnection.mockImplementation(async (fn) => {
      return await fn({ execute: connExecuteMock });
    });

    await repo.agregarCiclo(id, ciclo);

    expect(db.withConnection).toHaveBeenCalledTimes(2); // una vez para guardar el protocolo y otra para agregar el ciclo
    expect(connExecuteMock).toHaveBeenCalledTimes(1);

    const [sql, binds, opts] = connExecuteMock.mock.calls[0];
    expect(sql).toMatch(/INSERT\s+INTO\s+ciclo/i);
    expect(binds).toMatchObject({
      protocolo_id: 123,
      ciclo_id: ciclo.id,
      regimen: ciclo.regimen,
      duracion_semanas: ciclo.duracion_semanas,
      ciclo_final: ciclo.ciclo_final ? 1 : 0,
    });
    expect(opts).toMatchObject({ autoCommit: true });
  });
});
