/* global describe, test, expect, jest, beforeEach  */
import Paciente from '../../src/domain/paciente';
import { RepositorioPaciente } from '../../src/persistance/repositorioPaciente';

// Mock de 'oracledb' porque lo usás adentro del método con require('oracledb')
jest.mock('oracledb', () => ({
  BIND_OUT: 3003,  // valores simbólicos; solo tienen que existir
  NUMBER: 2010
}));

describe(RepositorioPaciente, () => {
  let connection;
  let repo;

  beforeEach(() => {
    connection = {
      execute: jest.fn(),
      rollback: jest.fn(),
      commit: jest.fn()
    };
    repo = new RepositorioPaciente(connection);
  });

  test('guardar paciente funciona correctamente devolviendo el id de la creación', async () => {
    const paciente = new Paciente(
      'Juan', 'Pérez', 'P12345', '2020-05-21', 30, 'M', 'OSDE'
    );

    connection.execute.mockResolvedValue({
      rowsAffected: 1,
      outBinds: { id: [123] }
    });

    const id = await repo.guardar(paciente);

    expect(id).toBe(123);
    expect(connection.execute).toHaveBeenCalledTimes(1); // Crear paciente


    const [sql1, binds1, opts1] = connection.execute.mock.calls[0];
    expect(sql1).toMatch(/INSERT\s+INTO\s+paciente/i);
    expect(binds1).toMatchObject({
      nombre: paciente.nombre,
      apellido: paciente.apellido,
      id_hospitalario: paciente.id_hospitalario,
      fecha_nacimiento: paciente.fecha_nacimiento,
      peso: paciente.peso,
      sexo: paciente.sexo,
      obra_social: paciente.obra_social,
      id : { dir: expect.any(Number), type: expect.any(Number) }
    });
    expect(opts1).toMatchObject({ autoCommit: true });
  });

  test('guardar paciente lanza error si no se crea', async () => {
    const paciente = new Paciente(
      'Lucía', 'Gómez', 'P67890', '2011-11-10', 55, 'F', null
    );

    connection.execute.mockResolvedValue({
      rowsAffected: 0,
      outBinds: { id: [] }
    });

    await expect(repo.guardar(paciente)).rejects.toThrow('Error al crear el paciente');
  });

  test('obtener paciente funciona correctamente devolviendo el objeto Paciente', async () => {
    const row = {
      NOMBRE: 'Juan',
      APELLIDO: 'Pérez',
      ID_HOSPITALARIO: 'P12345',
      FECHA_NACIMIENTO: '2020-05-21',
      PESO: 30,
      SEXO: 'M',
      PACIENTE_ID: 123,
      ULTIMA_MODIFICACION: null,
      OBRA_SOCIAL: 'OSDE'
    };

    connection.execute.mockResolvedValue({
      rows: [row]
    });

    const paciente = await repo.obtener(123);

    expect(paciente).toBeInstanceOf(Paciente);
    expect(paciente).toMatchObject({
      nombre: row.NOMBRE,
      apellido: row.APELLIDO,
      id_hospitalario: row.ID_HOSPITALARIO,
      fecha_nacimiento: row.FECHA_NACIMIENTO,
      peso: row.PESO,
      sexo: row.SEXO,
      paciente_id: row.PACIENTE_ID,
      ultima_modificacion: row.ULTIMA_MODIFICACION,
      obra_social: row.OBRA_SOCIAL
    });

    expect(connection.execute).toHaveBeenCalledTimes(1);
    const [sql, binds] = connection.execute.mock.calls[0];
    expect(sql).toMatch(/SELECT\s+paciente_id,\s+nombre,\s+apellido,\s+id_hospitalario/i);
    expect(binds).toEqual([123]);
  });

  test('obtener paciente lanza error si no se encuentra el id', async () => {
    connection.execute.mockResolvedValue({
      rows: []
    });

    await expect(repo.obtener(999)).rejects.toThrow('Paciente no encontrado');
  });
});
