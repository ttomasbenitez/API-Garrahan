/* global describe, test, expect, jest, beforeEach */
import oracleDB from '../../src/db/connection_pool.js';
import RecetaPaciente from '../../src/domain/receta/recetaPaciente.js';
import { RepositorioRecetaPaciente } from '../../src/persistance/repositorioRecetaPaciente.js';

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

describe(RepositorioRecetaPaciente, () => {
  let repo;
  let db;

  beforeEach(() => {
    db = oracleDB;
    repo = new RepositorioRecetaPaciente(db);

    db.execute.mockReset();
    db.withConnection.mockReset();
  });

  test('guardar presentacion de droga funciona correctamente devolviendo el id de la creación', async () => {
    const rp = new RecetaPaciente(1, 1, 0, 120, 20, 'activo', 70, 175, 1.8);

    db.execute.mockResolvedValue({
      rowsAffected: 1,
      outBinds: { id: [456], fecha_receta: [new Date('2025-08-09')] }
    });

    const id = await repo.guardar(rp);

    expect(id).toBe(456);
    expect(db.execute).toHaveBeenCalledTimes(1);
    const [sql, binds, opts] = db.execute.mock.calls[0];

    expect(sql).toMatch(/INSERT\s+INTO\s+receta_paciente/i);
    expect(binds).toMatchObject({
      protocolo_id: rp.protocolo_id,
      ciclo_id: rp.ciclo_id,
      regimen: rp.regimen,
      paciente_id: rp.paciente_id,
      profesional_id: rp.profesional_id,
      estado: rp.estado,
      peso: rp.peso,
      talla: rp.talla,
      superficie_corporal: rp.superficie_corporal,
    });

  });

  test('obtener una receta por su id funciona correctamente', async ()  => {

    const rp = new RecetaPaciente(1, 1, 0, 120, 20, 'activo', 70, 175, 1.8);

    db.execute.mockResolvedValue({
      rowsAffected: 1,
      outBinds: { id: [456], fecha_receta: [new Date('2025-08-09')] }
    });

    await repo.guardar(rp);

    const row = {
      PROTOCOLO_ID: 1,
      CICLO_ID: 1,
      REGIMEN: 0,
      PACIENTE_ID: 120,
      PROFESIONAL_ID: 20,
      ESTADO: 'activo',
      PESO: 70,
      TALLA: 175,
      SUPERFICIE_CORPORAL: 1.8
    };

    db.execute.mockResolvedValue({
      rows: [row]
    });

    const recetaObtenida = await repo.obtener(456);

    expect(db.execute).toHaveBeenCalledTimes(2);
    expect(recetaObtenida).toMatchObject({
      protocolo_id: rp.protocolo_id,
      ciclo_id: rp.ciclo_id,
      regimen: rp.regimen,
      paciente_id: rp.paciente_id,
      profesional_id: rp.profesional_id,
      estado: rp.estado,
      peso: rp.peso,
      talla: rp.talla,
      superficie_corporal: rp.superficie_corporal,
    });
  });

});
