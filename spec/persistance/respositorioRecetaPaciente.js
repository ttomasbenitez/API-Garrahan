/* global describe, test, expect, jest, beforeEach */
import RecetaPaciente from '../../src/domain/receta/recetaPaciente.js';
import { RepositorioRecetaPaciente } from '../../src/persistance/repositorioRecetaPaciente.js';

// Mock de 'oracledb' porque lo usás adentro del método con require('oracledb')
jest.mock('oracledb', () => ({
  BIND_OUT: 3003,  // valores simbólicos; solo tienen que existir
  NUMBER: 2010
}));

describe(RepositorioRecetaPaciente, () => {
  let connection;
  let repo;

  beforeEach(() => {
    connection = { execute: jest.fn() };
    repo = new RepositorioRecetaPaciente(connection);
  });

  test('guardar presentacion de droga funciona correctamente devolviendo el id de la creación', async () => {
    const rp = new RecetaPaciente(1, 1, 0, 120, 20, new Date('2024-06-15'), 'activo', 70, 175, 1.8, 50);

    connection.execute.mockResolvedValue({
      rowsAffected: 1,
      outBinds: { id: [456] }
    });

    const id = await repo.guardar(rp);

    expect(id).toBe(456);
    expect(connection.execute).toHaveBeenCalledTimes(1);
    const [sql, binds, opts] = connection.execute.mock.calls[0];
    expect(sql).toMatch(/INSERT\s+INTO\s+receta_paciente/i);
    expect(binds).toMatchObject({
      protocolo_id: rp.protocolo_id,
      ciclo_id: rp.ciclo_id,
      regimen: rp.regimen,
      paciente_id: rp.paciente_id,
      profesional_id: rp.profesional_id,
      fecha_receta: rp.fecha_receta,
      estado: rp.estado,
      peso: rp.peso,
      talla: rp.talla,
      superficie_corporal: rp.superficie_corporal,
    });

  });

});
