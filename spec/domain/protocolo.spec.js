/* global describe, test, expect, jest, beforeEach  */
import oracleDB from '../../src/db/connection_pool.js';
import Ciclo from '../../src/domain/protocolo/ciclo.js';
import Protocolo from '../../src/domain/protocolo/index.js';
import { RepositorioProtocolo } from '../../src/persistance/repositorioProtocolo.js';

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

describe('Protocolo', () => {
  let protocolo;
  let repo;
  let db;
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

  const agregarCiclo = async (idProtocolo, ciclos) => {
    const ids = Array.from({ length: 1 }, (v, i) => ({ id: [i] }));
    const connExecuteMock = jest.fn().mockResolvedValueOnce({
      rowsAffected: 1,
      outBinds: ids,
    });

    // Mock para db.withConnection
    db.withConnection.mockImplementation(async (fn) => {
      return await fn({
        execute: jest.fn().mockResolvedValue({
          rowsAffected: ciclos.length,
          outBinds: { id: [idProtocolo] },
        }),
        executeMany: connExecuteMock,
      });
    });
    await protocolo.agregarCiclo(ciclos, repo);
  };

  beforeEach(() => {
    db = oracleDB;
    repo = new RepositorioProtocolo(db);

    db.execute.mockReset();
    db.withConnection.mockReset();
  });

  test('deberia crear un protocolo con todos los campos obligatorios', () => {
    const protocol = new Protocolo('Osteosarcoma GBTO 2006 - No metastásico', 'Osteosarcoma', 'primera linea', 1);
    expect(protocol.nombre).toBe('Osteosarcoma GBTO 2006 - No metastásico');
    expect(protocol.enfermedad).toBe('Osteosarcoma');
    expect(protocol.linea).toBe('primera linea');
  });

  test('deberia poder agregar ciclos asociados al protocolo', async () => {
    const id = await agregarProtocolo();

    const connExecuteMock = jest.fn().mockResolvedValueOnce({
      rowsAffected: 1,
      outBinds: [{ id: [1] }],
    });

    // Mock para db.withConnection
    db.withConnection.mockImplementation(async (fn) => {
      return await fn({
        execute: jest.fn().mockResolvedValue({
          rowsAffected: 1,
          outBinds: { id: [123] },
        }),
        executeMany: connExecuteMock,
      });
    });
    await agregarCiclo(id, [new Ciclo(10, id, 0, 5, false, 1)]);
    expect(protocolo.ciclos.length).toBe(1);
    expect(protocolo.ciclos[0].ciclo_id).toBe(10);
    expect(protocolo.ciclos[0].regimen).toBe(0);
    expect(protocolo.ciclos[0].duracion_semanas).toBe(5);
  });

  test('puedo validar si un ciclo de un regimen existe en el protocolo', async () => {
    const id = await agregarProtocolo();
    await agregarCiclo(id, [new Ciclo(1, id, 0, 2, false), new Ciclo(1, id, 1, 5, true)]);

    const ciclo1Regimen0 = protocolo.validarCicloEnRegimen(1, 0);
    expect(ciclo1Regimen0).toBeInstanceOf(Ciclo);
    expect(ciclo1Regimen0.duracion_semanas).toBe(2);

    const ciclo1Regimen1 = protocolo.validarCicloEnRegimen(1, 1);
    expect(ciclo1Regimen1).toBeInstanceOf(Ciclo);
    expect(ciclo1Regimen1.duracion_semanas).toBe(5);

  });

});
