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
    expect(recetaObtenida.contexto.numeroCiclo).toBe(recetaEsperada.contexto.numeroCiclo);

    expect(recetaObtenida.paciente_snapshot.identidad.nombre).toBe(recetaEsperada.paciente_snapshot.identidad.nombre);
    expect(recetaObtenida.paciente_snapshot.identidad.apellido).toBe(recetaEsperada.paciente_snapshot.identidad.apellido);
    expect(recetaObtenida.paciente_snapshot.contacto.email).toBe(recetaEsperada.paciente_snapshot.contacto.email);
    expect(recetaObtenida.datos_paciente.peso).toBe(recetaEsperada.datos_paciente.peso);
    expect(recetaObtenida.datos_paciente.talla).toBe(recetaEsperada.datos_paciente.talla);
    expect(recetaObtenida.datos_paciente.superficieCorporal).toBe(recetaEsperada.datos_paciente.superficieCorporal);
    expect(recetaObtenida.estado).toBe(recetaEsperada.estado);
  });

});
