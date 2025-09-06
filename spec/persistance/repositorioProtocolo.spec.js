/* global describe, test, expect, jest, beforeEach  */
import Protocolo from '../../src/domain/protocolo';
import { RepositorioProtocolo } from '../../src/persistance/repositorioProtocolo';
// Mock de 'oracledb' porque lo usás adentro del método con require('oracledb')
jest.mock('oracledb', () => ({
  BIND_OUT: 3003,  // valores simbólicos; solo tienen que existir
  NUMBER: 2010
}));

describe(RepositorioProtocolo, () => {
  let connection;
  let repo;

  beforeEach(() => {
    connection = { execute: jest.fn() };
    repo = new RepositorioProtocolo(connection);
  });

  test('guardar protocolo funciona correctamente devolviendo el id de la creación', async () => {
    const protocolo = new Protocolo('Osteosarcoma GBTO 2006 - No metastásico', 'Osteosarcoma', 'primera linea');

    connection.execute.mockResolvedValue({
      rowsAffected: 1,
      outBinds: { id: [123] }
    });

    const id = await repo.guardar(protocolo);

    expect(id).toBe(123);
    expect(connection.execute).toHaveBeenCalledTimes(1);

    const [sql, binds, opts] = connection.execute.mock.calls[0];
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
    const protocolo = new Protocolo('Osteosarcoma GBTO 2006 - No metastásico', 'Osteosarcoma', 'primera linea');

    connection.execute.mockResolvedValue({
      rowsAffected: 0,
      outBinds: { id: [] }
    });

    await expect(repo.guardar(protocolo)).rejects.toThrow('Error al crear el protocolo');
  });

  test('obtener protocolo funciona correctamente devolviendo el objeto Protocolo', async () => {
    const row = {
      protocolo_id: 123,
      nombre: 'Osteosarcoma GBTO 2006 - No metastásico',
      enfermedad: 'Osteosarcoma',
      linea: 'primera linea'
    };

    connection.execute.mockResolvedValue({
      rows: [row]
    });

    const protocolo = await repo.obtener(123);

    expect(protocolo).toBeInstanceOf(Protocolo);
    expect(protocolo).toMatchObject({
      nombre: row.nombre,
      enfermedad: row.enfermedad,
      linea: row.linea
    });

    expect(connection.execute).toHaveBeenCalledTimes(1);
    const [sql, binds] = connection.execute.mock.calls[0];
    expect(sql).toMatch(/SELECT\s+protocolo_id,\s+nombre,\s+enfermedad,\s+linea\s+FROM\s+protocolo/i);
    expect(binds).toEqual([123]);
  });
});
