/* global describe, test, expect, jest, beforeEach */
import Alarma from '../../src/domain/alarma/alarma';
import { RepositorioAlarma } from '../../src/persistance/repositorioAlarma';

describe('RepositorioAlarma', () => {
  let db;
  let repo;

  beforeEach(() => {
    db = {
      execute: jest.fn(),
      executeMany: jest.fn()
    };
    repo = new RepositorioAlarma(db);
  });

  describe('listar', () => {
    test('deberia obtener todas las alarmas correctamente', async () => {
      const fecha1 = new Date('2025-10-20T10:00:00Z');
      const fecha2 = new Date('2025-10-15T10:00:00Z');

      db.execute.mockResolvedValue({
        rows: [
          {
            ALARMA_ID: 1,
            PACIENTE_ID: 123,
            FECHA_ULTIMA_RECETA: fecha1,
            DIAS_TRANSCURRIDOS: 18
          },
          {
            ALARMA_ID: 2,
            PACIENTE_ID: 456,
            FECHA_ULTIMA_RECETA: fecha2,
            DIAS_TRANSCURRIDOS: 23
          }
        ]
      });

      const alarmas = await repo.listar();

      expect(alarmas).toHaveLength(2);
      expect(alarmas[0]).toBeInstanceOf(Alarma);
      expect(alarmas[0].alarma_id).toBe(1);
      expect(alarmas[0].paciente_id).toBe(123);
      expect(alarmas[0].dias_transcurridos).toBe(18);
      expect(alarmas[1].alarma_id).toBe(2);
      expect(db.execute).toHaveBeenCalledTimes(1);

      const [sql] = db.execute.mock.calls[0];
      expect(sql).toMatch(/SELECT[\s\S]*FROM\s+alarmas/i);
      expect(sql).toMatch(/ORDER BY\s+dias_transcurridos\s+DESC/i);
    });

    test('deberia devolver array vacio si no hay alarmas', async () => {
      db.execute.mockResolvedValue({
        rows: []
      });

      const alarmas = await repo.listar();

      expect(alarmas).toHaveLength(0);
      expect(Array.isArray(alarmas)).toBe(true);
    });
  });

  describe('listarPorProfesional', () => {
    test('deberia obtener alarmas de pacientes asociados a un profesional', async () => {
      const fecha1 = new Date('2025-10-20T10:00:00Z');
      const fecha2 = new Date('2025-10-18T10:00:00Z');
      const profesionalId = 10;

      db.execute.mockResolvedValue({
        rows: [
          {
            ALARMA_ID: 1,
            PACIENTE_ID: 123,
            FECHA_ULTIMA_RECETA: fecha1,
            DIAS_TRANSCURRIDOS: 18
          },
          {
            ALARMA_ID: 3,
            PACIENTE_ID: 789,
            FECHA_ULTIMA_RECETA: fecha2,
            DIAS_TRANSCURRIDOS: 20
          }
        ]
      });

      const alarmas = await repo.listarPorProfesional(profesionalId);

      expect(alarmas).toHaveLength(2);
      expect(alarmas[0]).toBeInstanceOf(Alarma);
      expect(alarmas[0].alarma_id).toBe(1);
      expect(alarmas[0].paciente_id).toBe(123);
      expect(alarmas[0].dias_transcurridos).toBe(18);
      expect(alarmas[1].paciente_id).toBe(789);
      expect(db.execute).toHaveBeenCalledTimes(1);

      const [sql, binds] = db.execute.mock.calls[0];
      expect(sql).toMatch(/SELECT\s+DISTINCT/i);
      expect(sql).toMatch(/FROM\s+alarmas\s+a/i);
      expect(sql).toMatch(/INNER\s+JOIN\s+paciente_profesional\s+pp/i);
      expect(sql).toMatch(/WHERE\s+pp\.profesional_id\s*=\s*:profesional_id/i);
      expect(sql).toMatch(/ORDER BY\s+a\.dias_transcurridos\s+DESC/i);
      expect(binds.profesional_id).toBe(profesionalId);
    });

    test('deberia devolver array vacio si el profesional no tiene pacientes con alarmas', async () => {
      db.execute.mockResolvedValue({
        rows: []
      });

      const alarmas = await repo.listarPorProfesional(99);

      expect(alarmas).toHaveLength(0);
      expect(Array.isArray(alarmas)).toBe(true);
      expect(db.execute).toHaveBeenCalledTimes(1);
    });

    test('deberia formatear correctamente las fechas en las alarmas', async () => {
      const fecha = new Date('2025-11-05T15:30:00Z');

      db.execute.mockResolvedValue({
        rows: [
          {
            ALARMA_ID: 5,
            PACIENTE_ID: 100,
            FECHA_ULTIMA_RECETA: fecha,
            DIAS_TRANSCURRIDOS: 3
          }
        ]
      });

      const alarmas = await repo.listarPorProfesional(5);

      expect(alarmas[0].fecha_ultima_receta).toBe('2025-11-05');
    });

    test('deberia manejar fecha_ultima_receta null', async () => {
      db.execute.mockResolvedValue({
        rows: [
          {
            ALARMA_ID: 6,
            PACIENTE_ID: 200,
            FECHA_ULTIMA_RECETA: null,
            DIAS_TRANSCURRIDOS: 10
          }
        ]
      });

      const alarmas = await repo.listarPorProfesional(7);

      expect(alarmas[0].fecha_ultima_receta).toBeNull();
    });
  });

  describe('limpiar', () => {
    test('deberia eliminar todas las alarmas correctamente', async () => {
      db.execute.mockResolvedValue({
        rowsAffected: 5
      });

      const result = await repo.limpiar();

      expect(result).toBe(5);
      expect(db.execute).toHaveBeenCalledTimes(1);

      const [sql, _binds, opts] = db.execute.mock.calls[0];
      expect(sql).toMatch(/DELETE\s+FROM\s+alarmas/i);
      expect(opts).toMatchObject({ autoCommit: true });
    });

    test('deberia devolver 0 si no habia alarmas para eliminar', async () => {
      db.execute.mockResolvedValue({
        rowsAffected: 0
      });

      const result = await repo.limpiar();

      expect(result).toBe(0);
    });
  });

  describe('guardarLote', () => {
    test('deberia guardar multiples alarmas correctamente', async () => {
      const alarmas = [
        {
          paciente_id: 123,
          fecha_ultima_receta: new Date('2025-10-20'),
          dias_transcurridos: 18
        },
        {
          paciente_id: 456,
          fecha_ultima_receta: new Date('2025-10-15'),
          dias_transcurridos: 23
        }
      ];

      db.executeMany.mockResolvedValue({
        rowsAffected: 2
      });

      const result = await repo.guardarLote(alarmas);

      expect(result).toBe(2);
      expect(db.executeMany).toHaveBeenCalledTimes(1);

      const [sql, binds, opts] = db.executeMany.mock.calls[0];
      expect(sql).toMatch(/INSERT\s+INTO\s+alarmas/i);
      expect(binds).toHaveLength(2);
      expect(binds[0].paciente_id).toBe(123);
      expect(binds[0].dias_transcurridos).toBe(18);
      expect(opts).toMatchObject({ autoCommit: true });
    });

    test('deberia devolver 0 si el array esta vacio', async () => {
      const result = await repo.guardarLote([]);

      expect(result).toBe(0);
      expect(db.executeMany).not.toHaveBeenCalled();
    });

    test('deberia devolver 0 si el parametro es null', async () => {
      const result = await repo.guardarLote(null);

      expect(result).toBe(0);
      expect(db.executeMany).not.toHaveBeenCalled();
    });
  });
});
