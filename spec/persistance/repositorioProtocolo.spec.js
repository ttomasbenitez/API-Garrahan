/* global describe, test, expect, jest, beforeEach  */
import oracleDB from '../../src/db/connection_pool.js';
import Ciclo from '../../src/domain/protocolo/ciclo.js';
import Protocolo from '../../src/domain/protocolo';
//import AdministracionMedicacion from '../../src/domain/protocolo/administracionMedicacion.js';
import { RepositorioProtocolo } from '../../src/persistance/repositorioProtocolo';
import AdministracionMedicacion from '../../src/domain/protocolo/administracionMedicacion.js';

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
  let ciclo;
  const admins = [];

  const agregarProtocolo = async () => {
    protocolo = new Protocolo('Osteosarcoma GBTO 2006 - No metastásico', 'Osteosarcoma', 'primera linea', 1);

    const connExecuteMock = jest.fn().mockResolvedValue({
      rowsAffected: 1,
      outBinds: { id: [123] },
    });
    db.withConnection.mockImplementation(async (fn) => {
      return await fn({ execute: connExecuteMock });
    });

    return {id: await repo.guardar(protocolo), connExecuteMock};
  };

  const agregarCiclo = async (idProtocolo) => {
    ciclo = new Ciclo(1, idProtocolo, 0, 5, false, 0);

    const ids = Array.from({ length: 1 }, (v, i) => ({ id: [i] }));
    const connExecuteMock = jest.fn().mockResolvedValueOnce({
      rowsAffected: 1,
      outBinds: ids,
      rows: [admins],
    });

    db.withConnection.mockImplementation(async (fn) => {
      return await fn({
        execute: jest.fn().mockResolvedValue({
          rowsAffected: 1,
          outBinds: { id: [123] },
        }),
        executeMany: connExecuteMock,
      });
    });

    await repo.agregarCiclo(idProtocolo, [ciclo]);
    return connExecuteMock;
  };

  const agregarAdministraciones = async (cantidad = 1) => {
    for(let i = 0; i < cantidad; i++) {
      const adminDiaria  = new AdministracionMedicacion(123, 1, 0, 10, 13,  50 * (i + 1), 'mg', 2+i, 0, 1, i);
      admins.push(adminDiaria);
    }

    const ids = Array.from({ length: cantidad }, (v, i) => ({ id: [i] }));

    const connExecuteMock = jest.fn().mockResolvedValueOnce({
      rowsAffected: cantidad,
      outBinds: ids,
      rows: [admins],
    });

    db.withConnection.mockImplementation(async (fn) => {
      return await fn({
        execute: jest.fn().mockResolvedValue({
          rowsAffected: 1,
          outBinds: { id: [123] },
        }),
        executeMany: connExecuteMock,
      });
    });

    return {id: await repo.guardar(admins), connExecuteMock};
  };

  beforeEach(() => {
    db = oracleDB;
    repo = new RepositorioProtocolo(db);

    db.execute.mockReset();
    db.withConnection.mockReset();
  });

  test('guardar protocolo funciona correctamente devolviendo el id de la creación', async () => {
    const {connExecuteMock, id} = await agregarProtocolo();

    expect(id).toBe(123);
    expect(db.withConnection).toHaveBeenCalledTimes(1);

    const [sql, binds, opts] = connExecuteMock.mock.calls[0];
    expect(sql).toMatch(/INSERT\s+INTO\s+protocolo/i);
    expect(binds).toMatchObject({
      nombre: protocolo.nombre,
      enfermedad: protocolo.enfermedad,
      linea: protocolo.linea
    });
    expect(opts).toMatchObject({ autoCommit: true });
  });

  test('guardar protocolo lanza error si no se crea', async () => {
    const protocolo = new Protocolo('Osteosarcoma GBTO 2006 - No metastásico', 'Osteosarcoma', 'primera linea', 3);

    db.withConnection.mockImplementation(async (fn) => {
      return await fn({
        execute: jest.fn().mockResolvedValue({
          rowsAffected: 0,
          outBinds: { id: [] }
        })
      });
    });

    await expect(repo.guardar(protocolo)).rejects.toThrow('Error al crear el protocolo');
  });

  test('obtener protocolo funciona correctamente devolviendo el objeto Protocolo', async () => {
    // CAMBIO: Ahora es un objeto con propiedades en mayúsculas
    const row = {
      PROTOCOLO_ID: 123,
      NOMBRE: 'Osteosarcoma GBTO 2006 - No metastásico',
      ENFERMEDAD: 'Osteosarcoma',
      LINEA: 'primera linea'
    };

    db.execute.mockResolvedValue({
      rows: [row]
    });

    db.withConnection.mockImplementation(async (fn) => {
      return await fn({
        execute: jest.fn().mockResolvedValue({
          rows: [row]
        })
      });
    });

    const protocolo = await repo.obtener(123);

    expect(protocolo).toBeInstanceOf(Protocolo);
    expect(protocolo).toMatchObject({
      nombre: 'Osteosarcoma GBTO 2006 - No metastásico',
      enfermedad: 'Osteosarcoma',
      linea: 'primera linea',
      protocolo_id: 123
    });

    expect(db.execute).toHaveBeenCalledTimes(2); // TODO: cambiar a 3 cuando se agregue la administración de medicación
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
    const {id} = await agregarProtocolo();
    const connExecuteMock = await agregarCiclo(id);

    expect(db.withConnection).toHaveBeenCalledTimes(2);
    expect(connExecuteMock).toHaveBeenCalledTimes(1);

    const [sql, binds, opts] = connExecuteMock.mock.calls[0];
    expect(sql).toMatch(/INSERT\s+INTO\s+ciclo/i);
    expect(binds[0]).toMatchObject({
      protocolo_id: 123,
      ciclo_id: ciclo.ciclo_id,
      regimen: ciclo.regimen,
      duracion_semanas: ciclo.duracion_semanas,
      ciclo_final: ciclo.ciclo_final ? 1 : 0,
      repeticiones: ciclo.repeticiones,
    });
    expect(opts).toMatchObject({ autoCommit: true });
  });

  test('deberia poder obtener todos los ciclos asociados a un protocolo', async () => {
    const {id} = await agregarProtocolo();
    await agregarCiclo(id);

    // Mock para la consulta de ciclos
    db.execute
      .mockResolvedValueOnce({
        rows: [{
          CICLO_ID: 1,
          PROTOCOLO_ID: id,
          REGIMEN: 0,
          DURACION_SEMANAS: 5,
          CICLO_FINAL: 0,
          REPETICIONES: 0
        }]
      })
      // Mock para la consulta de administracion_medicacion
      .mockResolvedValueOnce({
        rows: []
      });

    const cicloObtenido = await repo.obtenerCiclos(id);
    expect(cicloObtenido[0]).toBeInstanceOf(Ciclo);
    expect(cicloObtenido[0]).toMatchObject(ciclo);
  });

  // test('dado un protocolo con ciclos y administraciones, deberia poder obtener todo el objeto completo', async () => {
  //   const {id} = await agregarProtocolo();
  //   await agregarCiclo(id);
  //   await agregarAdministraciones(2);

  //   expect(db.withConnection).toHaveBeenCalledTimes(3);

  //   db.execute
  //     .mockResolvedValueOnce({
  //       rows: [{
  //         PROTOCOLO_ID: 123,
  //         NOMBRE: 'Protocolo de prueba',
  //         ENFERMEDAD: 'Enfermedad de prueba',
  //         LINEA: 'Primera línea'
  //       }]
  //     })
  //     .mockResolvedValueOnce({
  //       rows: [{
  //         CICLO_ID: 1,
  //         PROTOCOLO_ID: 123,
  //         REGIMEN: 0,
  //         DURACION_SEMANAS: 4,
  //         CICLO_FINAL: 0,
  //         REPETICIONES: 1
  //       }]
  //     })
  //     .mockResolvedValueOnce({
  //       rows: [
  //         {
  //           PROTOCOLO_ID: 123,
  //           CICLO_ID: 1,
  //           REGIMEN: 0,
  //           VIA_ID: 10,
  //           DROGA_ID: 1,
  //           FUERZA: 50,
  //           FUERZA_UNIDAD: 'mg',
  //           CANTIDAD_DIAS: 2,
  //           ADMINISTRACION_DIARIA: 0,
  //           FRECUENCIA_DIARIA: 1,
  //           ID: 1
  //         },
  //         {
  //           PROTOCOLO_ID: 123,
  //           CICLO_ID: 1,
  //           REGIMEN: 0,
  //           VIA_ID: 10,
  //           DROGA_ID: 1,
  //           FUERZA: 50,
  //           FUERZA_UNIDAD: 'mg',
  //           CANTIDAD_DIAS: 2,
  //           ADMINISTRACION_DIARIA: 0,
  //           FRECUENCIA_DIARIA: 1,
  //           ID: 2
  //         }
  //       ]
  //     });

  //   const protocoloObtenido = await repo.obtener(id);
  //   console.log(protocoloObtenido);

  //   const ciclos = protocoloObtenido.ciclos;
  //   const administraciones = ciclos[0].administracion_medicacion;

  //   expect(ciclos.length).toBe(1);
  //   expect(administraciones.length).toBe(2);
  //   expect(administraciones[0]).toBeInstanceOf(AdministracionMedicacion);
  //   expect(administraciones[1]).toBeInstanceOf(AdministracionMedicacion);
  //   expect(administraciones[0]).toMatchObject(admins[0]);
  //   expect(administraciones[1]).toMatchObject(admins[1]);
  // });
});
