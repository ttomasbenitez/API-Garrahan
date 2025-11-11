/* global describe, test, expect, jest, beforeEach */
import RecetaPaciente from '../../src/domain/receta/recetaPaciente.js';
import { RepositorioRecetaPaciente } from '../../src/persistance/repositorioRecetaPaciente.js';
import { createMockOracleDB } from '../helpers/mockConnection.js';

describe(RepositorioRecetaPaciente, () => {
  let repo;
  let db;

  beforeEach(() => {
    const { mockPool } = createMockOracleDB();
    db = mockPool;
    repo = new RepositorioRecetaPaciente(db);
  });

  const guardarRecetaPaciente = async () => {
    const body = {
      nombre: 'Juan',
      apellido: 'Pérez',
      tipo_documento: 'DNI',
      numero_documento: '40123456',
      fecha_nacimiento: '2020-05-21',
      sexo: 'M',
      nacionalidad: 'Argentina',
      domicilio_calle: 'Av. Corrientes',
      domicilio_numero: '1234',
      localidad: 'CABA',
      telefono: '1122334455',
      email: 'juan.perez@example.com',
      peso: 70,
      talla: 175,
      superficie_corporal: 1.8,
      diagnostico: 'Leucemia Linfoblástica Aguda',
      protocolo_id: 1,
      ciclo_id: 1,
      regimen: 1,
      paciente_id: 1,
      profesional_id: 2,
      estado: 'Activo',
      detalles: []
    };

    const recetaPaciente = RecetaPaciente.fromBody(body);

    const mockExecute = jest.fn().mockResolvedValue({
      rowsAffected: 1,
      outBinds: {
        id: [123],
        fecha_prescripcion_out: [new Date('2025-10-27')],
      },
    });

    const mockConn = {
      execute: mockExecute,
      executeMany: jest.fn().mockResolvedValue({ rowsAffected: 0 }), // no hay detalles
      commit: jest.fn(),
      rollback: jest.fn(),
    };

    db.withConnection.mockImplementation(async (fn) => await fn(mockConn));

    const id = await repo.guardar(recetaPaciente);

    return {id, mockExecute, mockConn, recetaPaciente};
  };

  test('guarda correctamente la receta y devuelve el objeto con id y fecha', async () => {

    const {id, mockExecute, mockConn} =  await guardarRecetaPaciente();


    expect(id).toBe(123);

    expect(mockExecute).toHaveBeenCalledTimes(1);
    const [sql, _binds, opts] = mockExecute.mock.calls[0];

    expect(sql).toMatch(/INSERT\s+INTO\s+receta_paciente/i);
    expect(opts).toMatchObject({ autoCommit: false });

    expect(mockConn.commit).toHaveBeenCalledTimes(1);
    expect(mockConn.rollback).not.toHaveBeenCalled();
  });

  test('elimina correctamente la receta paciente', async () => {
    // Primero reusamos tu helper que guarda y prepara los mocks
    const { id, mockExecute, mockConn } = await guardarRecetaPaciente();
    expect(id).toBe(123);
    expect(mockExecute).toHaveBeenCalledTimes(1); // del guardar

    // Preparamos el comportamiento para eliminar
    mockConn.execute.mockResolvedValueOnce({ rowsAffected: 1 }) // DELETE detalle
      .mockResolvedValueOnce({ rowsAffected: 1 }); // DELETE paciente
    mockConn.commit.mockResolvedValue();

    db.withConnection.mockImplementation(async (fn) => await fn(mockConn));

    await repo.eliminar(id);

    expect(mockConn.execute).toHaveBeenCalledTimes(2 + 1);

    const [, ...calls] = mockConn.execute.mock.calls;

    const [sql1, binds1, opts1] = calls[0];
    const [sql2, binds2, opts2] = calls[1];

    expect(sql1).toMatch(/DELETE\s+FROM\s+receta_detalle/i);
    expect(binds1).toEqual({ id });
    expect(opts1).toMatchObject({ autoCommit: false });

    expect(sql2).toMatch(/DELETE\s+FROM\s+receta_paciente/i);
    expect(binds2).toEqual({ id });
    expect(opts2).toMatchObject({ autoCommit: false });

    // expect(mockConn.commit).toHaveBeenCalledTimes(1);
    expect(mockConn.rollback).not.toHaveBeenCalled();
  });

});
