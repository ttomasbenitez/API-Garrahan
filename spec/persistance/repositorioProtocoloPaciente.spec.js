/* global describe, test, expect, jest, beforeEach  */
import ProtocoloPaciente from '../../src/domain/protocoloPaciente.js';
import { RepositorioProtocoloPaciente } from '../../src/persistance/repositorioProtocoloPaciente.js';

jest.mock('oracledb', () => ({
  BIND_OUT: 3003,
  NUMBER: 2010
}));

describe(RepositorioProtocoloPaciente, () => {
  let connection;
  let repo;

  beforeEach(() => {
    connection = {
      execute: jest.fn()
    };
    repo = new RepositorioProtocoloPaciente(connection);
  });

  test('guardar protocolo paciente devuelve id autogenerado', async () => {
    const pp = new ProtocoloPaciente({
      paciente_id: 1,
      protocolo_id: 2,
      regimen: 1,
      ciclo_actual_id: 3,
      numero_ciclo: 1,
      fecha_inicio: '2025-10-08',
      fecha_fin: '2025-10-22',
      estado: 'activo',
      profesional_id_asignador: 101,
      fecha_asignacion: '2025-10-08T12:00:00'
    });

    connection.execute.mockResolvedValue({
      rowsAffected: 1,
      outBinds: { id: [55] }
    });

    const id = await repo.guardar(pp);

    expect(id).toBe(55);
    expect(pp.protocolo_paciente_id).toBe(55);

    const [sql, binds, opts] = connection.execute.mock.calls[0];
    expect(sql).toMatch(/INSERT\s+INTO\s+protocolo_paciente/i);
    expect(binds).toMatchObject({
      paciente_id: pp.paciente_id,
      protocolo_id: pp.protocolo_id,
      regimen: pp.regimen,
      ciclo_actual_id: pp.ciclo_actual_id,
      numero_ciclo: pp.numero_ciclo,
      fecha_inicio: pp.fecha_inicio,
      fecha_fin: pp.fecha_fin,
      estado: pp.estado,
      profesional_id_asignador: pp.profesional_id_asignador,
      fecha_asignacion: pp.fecha_asignacion,
      id: { dir: expect.any(Number), type: expect.any(Number) }
    });
    expect(opts).toMatchObject({ autoCommit: true });
  });

  test('guardar lanza error si rowsAffected es 0', async () => {
    const pp = new ProtocoloPaciente({
      paciente_id: 1,
      protocolo_id: 2,
      regimen: 1,
      ciclo_actual_id: 3
    });

    connection.execute.mockResolvedValue({
      rowsAffected: 0,
      outBinds: { id: [] }
    });

    await expect(repo.guardar(pp)).rejects.toThrow('Error al crear el protocolo del paciente');
  });

  test('obtener por paciente devuelve lista de protocolos', async () => {
    const rows = [
      {
        PROTOCOLO_PACIENTE_ID: 10,
        PACIENTE_ID: 1,
        PROTOCOLO_ID: 2,
        REGIMEN: 1,
        CICLO_ACTUAL_ID: 3,
        NUMERO_CICLO: 1,
        FECHA_INICIO: '2025-10-08',
        FECHA_FIN: '2025-10-22',
        ESTADO: 'activo',
        PROFESIONAL_ID_ASIGNADOR: 101,
        FECHA_ASIGNACION: '2025-10-08T12:00:00'
      }
    ];

    connection.execute.mockResolvedValue({ rows });

    const result = await repo.obtenerPorPaciente(1);

    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toBeInstanceOf(ProtocoloPaciente);
    expect(result[0].protocolo_paciente_id).toBe(10);

    const [sql, binds] = connection.execute.mock.calls[0];
    expect(sql).toMatch(/SELECT\s+\*\s+FROM\s+protocolo_paciente/i);
    expect(binds).toMatchObject({ paciente_id: 1 });
  });

  test('obtener por paciente y protocolo_id devuelve solo ese protocolo', async () => {
    const rows = [
      {
        PROTOCOLO_PACIENTE_ID: 10,
        PACIENTE_ID: 1,
        PROTOCOLO_ID: 2,
        REGIMEN: 1,
        CICLO_ACTUAL_ID: 3,
        NUMERO_CICLO: 1,
        FECHA_INICIO: '2025-10-08',
        FECHA_FIN: '2025-10-22',
        ESTADO: 'activo',
        PROFESIONAL_ID_ASIGNADOR: 101,
        FECHA_ASIGNACION: '2025-10-08T12:00:00'
      }
    ];

    connection.execute.mockResolvedValue({ rows });

    const result = await repo.obtenerPorPaciente(1, 2);

    expect(result.length).toBe(1);
    expect(result[0].protocolo_id).toBe(2);

    const [sql, binds] = connection.execute.mock.calls[0];
    expect(sql).toMatch(/SELECT\s+\*\s+FROM\s+protocolo_paciente/i);
    expect(binds).toMatchObject({ paciente_id: 1, protocolo_id: 2 });
  });


  //test('updateRegimen actualiza el régimen correctamente', async () => {
  //  const protocolo_paciente_id = 10;
  //  const nuevo_regimen = 5;
  //  connection.execute.mockResolvedValue({ rowsAffected: 1 });
//
  //  const result = await repo.updateRegimen(protocolo_paciente_id, nuevo_regimen);
  //  expect(result).toBe(true);
//
  //  const [sql, binds, opts] = connection.execute.mock.calls[0];
  //  expect(sql).toMatch(/UPDATE\s+protocolo_paciente/i);
  //  expect(binds).toMatchObject({ nuevo_regimen, protocolo_paciente_id });
  //  expect(opts).toMatchObject({ autoCommit: true });
  //});
//
  //test('updateRegimen retorna false si no se actualiza ningún registro', async () => {
  //  connection.execute.mockResolvedValue({ rowsAffected: 0 });
  //  const result = await repo.updateRegimen(99, 7);
  //  expect(result).toBe(false);
  //});
});
