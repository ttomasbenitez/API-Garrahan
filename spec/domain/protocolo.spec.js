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

  test('deberia obtener un protocolo con todos los campos a partir de un row', () => {
    const row = [
      1,
      'Osteosarcoma GBTO 2006 - No metastásico',
      'Osteosarcoma',
      'primera linea'
    ];
    const protocolo = Protocolo.fromRow(row, []);
    expect(protocolo.nombre).toBe('Osteosarcoma GBTO 2006 - No metastásico');
    expect(protocolo.enfermedad).toBe('Osteosarcoma');
    expect(protocolo.linea).toBe('primera linea');
    expect(protocolo.protocolo_id).toBe(1);
    expect(protocolo.ciclos.length).toBe(0);
  });

  test('deberia poder agregar ciclos asociados al protocolo', async () => {
    const id = await agregarProtocolo();
    await protocolo.agregarCiclo(new Ciclo(1, id, 0, 5, false), repo);
    expect(protocolo.ciclos.length).toBe(1);
  });

  test('puedo validar si un ciclo de un regimen existe en el protocolo', async () => {
    const id = await agregarProtocolo();
    await protocolo.agregarCiclo(new Ciclo(1, id, 0, 2, false), repo);
    await protocolo.agregarCiclo(new Ciclo(1, id, 1, 5, true), repo);

    const ciclo1Regimen0 = protocolo.validarCicloEnRegimen(1, 0);
    expect(ciclo1Regimen0).toBeInstanceOf(Ciclo);
    expect(ciclo1Regimen0.duracion_semanas).toBe(2);

    const ciclo1Regimen1 = protocolo.validarCicloEnRegimen(1, 1);
    expect(ciclo1Regimen1).toBeInstanceOf(Ciclo);
    expect(ciclo1Regimen1.duracion_semanas).toBe(5);

  });

});
