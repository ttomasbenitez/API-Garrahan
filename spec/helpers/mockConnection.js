/* global jest  */
/* test/helpers/mockOracleDB.js */
export function createMockOracleDB({
  // Config global por defecto
  rowsAffected = 1,
  rows = [],
  outBinds = {},
  throwAt = null,   // "execute" | "executeMany" | "commit" | "rollback"
  error = null,
} = {}) {
  // Mocks de las funciones típicas de una conexión Oracle
  const conn = {
    execute: jest.fn(async () => {
      if (throwAt === 'execute') throw error ?? new Error('execute failed');
      return { rowsAffected, rows, outBinds };
    }),

    executeMany: jest.fn(async (bindsArr) => {
      if (throwAt === 'executeMany') throw error ?? new Error('executeMany failed');
      return { rowsAffected: bindsArr?.length ?? rowsAffected, outBinds };
    }),

    commit: jest.fn(async () => {
      if (throwAt === 'commit') throw error ?? new Error('commit failed');
      return;
    }),

    rollback: jest.fn(async () => {
      if (throwAt === 'rollback') throw error ?? new Error('rollback failed');
      return;
    }),
  };

  // Mock del pool de conexión
  const mockPool = {
    init: jest.fn(),
    getPool: jest.fn(),
    close: jest.fn(),
    withConnection: jest.fn(async (fn) => await fn(conn)),
    execute: jest.fn(), // si tu repo llama directo sin withConnection
  };

  return { mockPool, conn };
}
