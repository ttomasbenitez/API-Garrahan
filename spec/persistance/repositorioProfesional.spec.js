/* global describe, test, expect, jest, beforeEach  */
import Profesional from '../../src/domain/profesional';
import { RepositorioProfesional } from '../../src/persistance/repositorioProfesional';

// Mock de 'oracledb' porque lo usás adentro del método con require('oracledb')
jest.mock('oracledb', () => ({
  BIND_OUT: 3003,  // valores simbólicos; solo tienen que existir
  NUMBER: 2010
}));

describe(RepositorioProfesional, () => {
  let connection;
  let repo;

  beforeEach(() => {
    connection = { execute: jest.fn() };
    repo = new RepositorioProfesional(connection);
  });

  test('guardar profesional con ID manual funciona correctamente', async () => {
    const profesional = new Profesional('Walter', 'Perez', 20981812, 'MP12345', 'Oncología', 123);

    connection.execute.mockResolvedValue({
      rowsAffected: 1
    });

    const id = await repo.guardar(profesional);

    expect(id).toBe(123);
    expect(connection.execute).toHaveBeenCalledTimes(1);

    const [sql, binds, opts] = connection.execute.mock.calls[0];
    expect(sql).toMatch(/INSERT\s+INTO\s+profesional/i);
    expect(binds).toMatchObject({
      nombre: profesional.nombre,
      apellido: profesional.apellido,
      dni: profesional.dni,
      matricula: profesional.matricula,
      especialidad: profesional.especialidad
    });
    expect(binds.id).toBe(123); // id manual
    expect(opts).toMatchObject({ autoCommit: true });
  });

  test('guardar profesional con ID autogenerado funciona correctamente', async () => {
    const profesional = new Profesional('Ana', 'Gomez', 20999999, 'MP54321', 'Pediatría');

    connection.execute.mockResolvedValue({
      rowsAffected: 1,
      outBinds: { id: [456] }
    });

    const id = await repo.guardar(profesional);

    expect(id).toBe(456);
    expect(connection.execute).toHaveBeenCalledTimes(1);

    const [sql, binds, opts] = connection.execute.mock.calls[0];
    expect(sql).toMatch(/INSERT\s+INTO\s+profesional/i);
    expect(binds).toMatchObject({
      nombre: profesional.nombre,
      apellido: profesional.apellido,
      dni: profesional.dni,
      matricula: profesional.matricula,
      especialidad: profesional.especialidad,
    });
    expect(binds.id).toMatchObject({ dir: expect.any(Number), type: expect.any(Number) }); // bind out
    expect(opts).toMatchObject({ autoCommit: true });
  });

  test('guardar profesional lanza error si no se crea', async () => {
    const profesional = new Profesional('Walter', 'Perez', 20981812, 'MP12345', 'Oncología', 123);

    connection.execute.mockResolvedValue({
      rowsAffected: 0,
      outBinds: { id: [] }
    });

    await expect(repo.guardar(profesional)).rejects.toThrow('Error al crear el profesional');
  });

  test('obtener profesional funciona correctamente devolviendo el objeto profesional', async () => {
    const row = {
      NOMBRE: 'Walter',
      APELLIDO: 'Perez',
      DNI: 20981812,
      MATRICULA: 'MP12345',
      ESPECIALIDAD: 'Oncología',
      ID: 123,
    };

    connection.execute.mockResolvedValue({
      rows: [row]
    });

    const profesional = await repo.obtener(123);

    expect(profesional).toBeInstanceOf(Profesional);
    expect(profesional).toMatchObject({
      nombre: row.NOMBRE,
      apellido: row.APELLIDO,
      dni: row.DNI,
      matricula: row.MATRICULA,
      especialidad: row.ESPECIALIDAD,
      id: row.ID,
    });

    expect(connection.execute).toHaveBeenCalledTimes(1);
    const [sql, binds] = connection.execute.mock.calls[0];
    expect(sql).toMatch(/SELECT\s+id,\s+nombre,\s+apellido,\s+dni/i);
    expect(binds).toEqual([123]);
  });

  test('obtener profesional lanza error si no se encuentra el id', async () => {
    connection.execute.mockResolvedValue({
      rows: []
    });

    await expect(repo.obtener(999)).rejects.toThrow('Profesional no encontrado');
  });
});
