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
