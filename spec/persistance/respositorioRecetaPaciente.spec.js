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


  test('guarda correctamente la receta y devuelve el objeto con id y fecha', async () => {
    // Arrange: construimos un RecetaPaciente válido
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
      numero_ciclo: 1,
      protocolo_id: 1,
      ciclo_id: 1,
      regimen: 1,
      paciente_id: 1,
      profesional_id: 2,
      estado: 'Activo'
    };

    const recetaPaciente = RecetaPaciente.fromBody(body);

    // Mock de ejecución Oracle
    db.execute.mockResolvedValue({
      rowsAffected: 1,
      outBinds: { id: [123], fecha_prescripcion: [new Date('2025-10-27')] }
    });

    // Act
    const result = await repo.guardar(recetaPaciente);

    // Assert
    expect(result.id).toBe(123);
    expect(result.fecha_prescripcion).toEqual(new Date('2025-10-27'));
    expect(db.execute).toHaveBeenCalledTimes(1);

    const [sql, binds, opts] = db.execute.mock.calls[0];

    expect(sql).toMatch(/INSERT\s+INTO\s+receta_paciente/i);
    expect(opts).toMatchObject({ autoCommit: true });

    // Verificamos que se hayan enviado los campos obligatorios
    expect(binds).toMatchObject({
      protocolo_id: 1,
      ciclo_id: 1,
      regimen: 1,
      paciente_id: 1,
      profesional_id: 2,
      estado: 'Activo',
      peso: 70,
      talla: 175,
      superficie_corporal: 1.8
    });
  });


  // test('obtener una receta por su id funciona correctamente', async ()  => {

  //   const rp = new RecetaPaciente(1, 1, 0, 120, 20, 'activo', 70, 175, 1.8);

  //   db.execute.mockResolvedValue({
  //     rowsAffected: 1,
  //     outBinds: { id: [456], fecha_receta: [new Date('2025-08-09')] }
  //   });

  //   await repo.guardar(rp);

  //   const row = {
  //     PROTOCOLO_ID: 1,
  //     CICLO_ID: 1,
  //     REGIMEN: 0,
  //     PACIENTE_ID: 120,
  //     PROFESIONAL_ID: 20,
  //     ESTADO: 'activo',
  //     PESO: 70,
  //     TALLA: 175,
  //     SUPERFICIE_CORPORAL: 1.8
  //   };

  //   db.execute.mockResolvedValue({
  //     rows: [row]
  //   });

  //   const recetaObtenida = await repo.obtener(456);

  //   expect(db.execute).toHaveBeenCalledTimes(2);
  //   expect(recetaObtenida).toMatchObject({
  //     protocolo_id: rp.protocolo_id,
  //     ciclo_id: rp.ciclo_id,
  //     regimen: rp.regimen,
  //     paciente_id: rp.paciente_id,
  //     profesional_id: rp.profesional_id,
  //     estado: rp.estado,
  //     peso: rp.peso,
  //     talla: rp.talla,
  //     superficie_corporal: rp.superficie_corporal,
  //   });
  // });

});
