/* global describe, test, expect, jest, beforeEach */
import oracleDB from '../../src/db/connection_pool.js';
import RecetaPaciente from '../../src/domain/receta/recetaPaciente.js';
import { RepositorioRecetaPaciente } from '../../src/persistance/repositorioRecetaPaciente.js';
import { toFloat } from '../../src/utils/formatters.js';
import { createMockOracleDB } from '../helpers/mockConnection.js';

describe(RepositorioRecetaPaciente, () => {
  let repo;
  let db;

  beforeEach(() => {
    const { mockPool } = createMockOracleDB();
    db = mockPool;
    repo = new RepositorioRecetaPaciente(db);

    // db.execute.mockReset();
    // db.withConnection.mockReset();
  });


  test('guarda correctamente la receta y devuelve el objeto con id y fecha', async () => {

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
      estado: 'Activo',
      detalles: []
    };

    const recetaPaciente = RecetaPaciente.fromBody(body);

    const mockExecute = jest.fn().mockResolvedValue({
      rowsAffected: 1,
      outBinds: {
        id: [123],
        fecha_prescripcion: [new Date('2025-10-27')],
      },
    });

    const mockConn = {
      execute: mockExecute,
      executeMany: jest.fn().mockResolvedValue({ rowsAffected: 0 }), // no hay detalles
      commit: jest.fn(),
      rollback: jest.fn(),
    };

    db.withConnection.mockImplementation(async (fn) => await fn(mockConn));

    const result = await repo.guardar(recetaPaciente);

    expect(result.id).toBe(123);
    expect(result.fecha_prescripcion).toEqual(new Date('2025-10-27'));

    expect(mockExecute).toHaveBeenCalledTimes(1);
    const [sql, binds, opts] = mockExecute.mock.calls[0];
    console.log(binds);
    expect(sql).toMatch(/INSERT\s+INTO\s+receta_paciente/i);
    expect(opts).toMatchObject({ autoCommit: false });

    expect(binds).toMatchObject({
      protocolo_id: 1,
      ciclo_id: 1,
      regimen: 1,
      paciente_id: 1,
      profesional_id: 2,
      estado: 'Activo',
      peso: 70,
      talla: 175,
    });

    expect(mockConn.commit).toHaveBeenCalledTimes(1);

    expect(mockConn.rollback).not.toHaveBeenCalled();
  });



  test('obtener una receta por su id funciona correctamente', async () => {
    // --- Datos base del cuerpo ---
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

    const recetaEsperada = RecetaPaciente.fromBody(body);

    db.execute.mockResolvedValueOnce({
      rows: [
        {
          RECETA_ID: 456,
          FECHA_PRESCRIPCION: new Date('2025-08-09'),
          NOMBRE: 'Juan',
          APELLIDO: 'Pérez',
          TIPO_DOCUMENTO: 'DNI',
          NUMERO_DOCUMENTO: '40123456',
          FECHA_NACIMIENTO: new Date('2020-05-21'),
          SEXO: 'M',
          NACIONALIDAD: 'Argentina',
          DOMICILIO_CALLE: 'Av. Corrientes',
          DOMICILIO_NUMERO: '1234',
          LOCALIDAD: 'CABA',
          TELEFONO: '1122334455',
          EMAIL: 'juan.perez@example.com',
          PESO: 70,
          TALLA: 175,
          SUPERFICIE_CORPORAL: 1.8,
          DIAGNOSTICO: 'Leucemia Linfoblástica Aguda',
          NUMERO_CICLO: 1,
          PROTOCOLO_ID: 1,
          CICLO_ID: 1,
          REGIMEN: 1,
          PACIENTE_ID: 1,
          PROFESIONAL_ID: 2,
          ESTADO: 'Activo'
        }
      ]
    });

    const recetaObtenida = await repo.obtener(456);

    expect(db.execute).toHaveBeenCalledTimes(1);
    expect(db.execute).toHaveBeenCalledWith(expect.stringMatching(/SELECT/i), [456], expect.any(Object));

    expect(recetaObtenida).toBeInstanceOf(RecetaPaciente);
    expect(recetaObtenida.contexto.protocolo_id).toBe(recetaEsperada.contexto.protocolo_id);
    expect(recetaObtenida.contexto.ciclo_id).toBe(recetaEsperada.contexto.ciclo_id);
    expect(recetaObtenida.contexto.regimen).toBe(recetaEsperada.contexto.regimen);
    expect(recetaObtenida.contexto.numero_ciclo).toBe(recetaEsperada.contexto.numero_ciclo);

    expect(recetaObtenida.paciente_snapshot.identidad.nombre).toBe(recetaEsperada.paciente_snapshot.identidad.nombre);
    expect(recetaObtenida.paciente_snapshot.identidad.apellido).toBe(recetaEsperada.paciente_snapshot.identidad.apellido);
    expect(recetaObtenida.paciente_snapshot.contacto.email).toBe(recetaEsperada.paciente_snapshot.contacto.email);
    expect(recetaObtenida.datos_paciente.peso).toBe(recetaEsperada.datos_paciente.peso);
    expect(recetaObtenida.datos_paciente.talla).toBe(recetaEsperada.datos_paciente.talla);
    expect(recetaObtenida.datos_paciente.superficie_corporal).toBe(recetaEsperada.datos_paciente.superficie_corporal);
    expect(recetaObtenida.estado).toBe(recetaEsperada.estado);
  });

});
