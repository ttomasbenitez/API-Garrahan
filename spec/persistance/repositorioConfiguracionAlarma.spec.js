/* global describe, test, expect, jest, beforeEach */
import ConfiguracionAlarma from '../../src/domain/alarma/configuracionAlarma';
import { RepositorioConfiguracionAlarma } from '../../src/persistance/repositorioConfiguracionAlarma';
import { ERROR_CONFIGURACION_NO_ENCONTRADA, ERROR_CONFIGURACION_ACTUALIZACION } from '../../src/errors/configuracionAlarma';

describe('RepositorioConfiguracionAlarma', () => {
  let connection;
  let repo;

  beforeEach(() => {
    connection = {
      execute: jest.fn(),
      rollback: jest.fn(),
      commit: jest.fn()
    };
    repo = new RepositorioConfiguracionAlarma(connection);
  });

  describe('obtener', () => {
    test('deberia obtener la configuracion correctamente', async () => {
      const fecha = new Date('2025-11-07T10:00:00Z');
      connection.execute.mockResolvedValue({
        rows: [
          {
            CONFIGURACION_ID: 1,
            LIMITE_DIAS: 14,
            ULTIMA_EJECUCION: fecha
          }
        ]
      });

      const config = await repo.obtener();

      expect(config).toBeInstanceOf(ConfiguracionAlarma);
      expect(config.configuracion_id).toBe(1);
      expect(config.limite_dias).toBe(14);
      expect(config.ultima_ejecucion).toBe(fecha);
      expect(connection.execute).toHaveBeenCalledTimes(1);

      const [sql] = connection.execute.mock.calls[0];
      expect(sql).toMatch(/SELECT[\s\S]*FROM\s+configuracion_alarma/i);
    });

    test('deberia lanzar error si no existe configuracion', async () => {
      connection.execute.mockResolvedValue({
        rows: []
      });

      await expect(repo.obtener()).rejects.toThrow(ERROR_CONFIGURACION_NO_ENCONTRADA);
    });
  });

  describe('actualizarLimite', () => {
    test('deberia actualizar el limite correctamente', async () => {
      connection.execute.mockResolvedValue({
        rowsAffected: 1
      });

      const result = await repo.actualizarLimite(30);

      expect(result).toBe(true);
      expect(connection.execute).toHaveBeenCalledTimes(1);

      const [sql, binds, opts] = connection.execute.mock.calls[0];
      expect(sql).toMatch(/UPDATE\s+configuracion_alarma[\s\S]*SET\s+limite_dias/i);
      expect(binds.limite_dias).toBe(30);
      expect(opts).toMatchObject({ autoCommit: true });
    });

    test('deberia lanzar error si no se actualiza', async () => {
      connection.execute.mockResolvedValue({
        rowsAffected: 0
      });

      await expect(repo.actualizarLimite(30)).rejects.toThrow(ERROR_CONFIGURACION_ACTUALIZACION);
    });
  });

  describe('actualizarUltimaEjecucion', () => {
    test('deberia actualizar la ultima ejecucion correctamente', async () => {
      connection.execute.mockResolvedValue({
        rowsAffected: 1
      });

      const result = await repo.actualizarUltimaEjecucion();

      expect(result).toBe(true);
      expect(connection.execute).toHaveBeenCalledTimes(1);

      const [sql, _binds, opts] = connection.execute.mock.calls[0];
      expect(sql).toMatch(/UPDATE\s+configuracion_alarma[\s\S]*SET\s+ultima_ejecucion/i);
      expect(sql).toMatch(/CURRENT_TIMESTAMP/i);
      expect(opts).toMatchObject({ autoCommit: true });
    });

    test('deberia lanzar error si no se actualiza', async () => {
      connection.execute.mockResolvedValue({
        rowsAffected: 0
      });

      await expect(repo.actualizarUltimaEjecucion()).rejects.toThrow(ERROR_CONFIGURACION_ACTUALIZACION);
    });
  });
});
