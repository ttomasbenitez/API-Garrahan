/* global describe, test, expect, jest, beforeEach */
import { ApiHospitalConector } from '../../src/connectors/hospitalApi.js';
import config from '../../config.js';
import axios from 'axios';
import Profesional from '../../src/domain/profesional.js';

// Source - https://stackoverflow.com/a
// Posted by Benny Neugebauer
// Retrieved 2025-11-09, License - CC BY-SA 4.0

jest.mock('axios');

describe('ApiHospitalConector', () => {

  let conector;

  beforeEach(() => {
    jest.clearAllMocks();
    config.app = { apiHospitalUrl: 'http://localhost:4000' };
    conector = new ApiHospitalConector();
    conector.apiClient = axios;
  });

  test('obtenerPaciente devuelve datos normalizados correctamente', async () => {

    axios.get.mockResolvedValueOnce({
      data: JSON.stringify({
        resourceType: 'Bundle',
        type: 'collection',
        entry: [{
          resourceType: 'Patient',
          id: '123',
          identifier: [
            { system: 'http://garrahan.example.org', value: 'P12345' },
            { system: 'DNI', value: '12345678' }
          ],
          name: [{ family: 'Pérez', given: ['Juan'] }],
          gender: 'male',
          birthDate: '2017-05-15',
          address: [{
            use: 'home',
            line: 'Av. Calchaqui, 1090, Piso 3B',
            number: '1090',
            city: 'Quilmes Oeste',
            district: 'Quilmes',
            postalCode: '1414',
            country: 'AR'
          }],
          telecom: [
            { system: 'phone', value: '+54-11-5555-5555', use: 'mobile' },
            { system: 'email', value: 'juan.perez@example.org' }
          ],
          extension: [{
            valueCodeableConcept: { text: 'Argentina' }
          }]
        },
        {
          resource: {
            resourceType: 'Coverage',
            payor: [{ display: 'OSDE' }]
          }
        },
        {
          resource: {
            resourceType: 'Condition',
            code: { text: 'Leucemia linfoblástica aguda' }
          }
        },
        {
          resource: {
            resourceType: 'Observation',
            id: 'obs-weight',
            valueQuantity: { value: 18.2 }
          }
        },
        {
          resource: {
            resourceType: 'Observation',
            id: 'obs-height',
            valueQuantity: { value: 110.0 }
          }
        },
        {
          resource: {
            resourceType: 'Observation',
            id: 'obs-bsa',
            valueQuantity: { value: 0.78 }
          }
        }]}),
      status: 200,
    });

    const paciente = await conector.obtenerPaciente('H001');

    expect(paciente).toEqual({
      nombre: 'Juan',
      apellido: 'Pérez',
      tipo_documento: 'DNI',
      numero_documento: '12345678',
      fecha_nacimiento: '2017-05-15',
      sexo: 'M',
      nacionalidad: 'Argentina',
      domicilio_calle: 'Av. Calchaqui',
      domicilio_numero: '1090',
      domicilio_piso_depto: '3B',
      codigo_postal: '1414',
      localidad: 'Quilmes Oeste',
      partido: 'Quilmes',
      telefono: '+54-11-5555-5555',
      email: 'juan.perez@example.org',
      peso: 18.2,
      talla: 110.0,
      superficie_corporal: 0.78,
      diagnostico: 'Leucemia linfoblástica aguda',
      obra_social: 'OSDE'
    });
  });

  test('lanza error si la respuesta no es 200', async () => {

    axios.get.mockResolvedValueOnce({
      data: {},
      status: 404,
    });

    await expect(conector.obtenerPaciente('999')).rejects.toThrow(
      'Error al consultar la API del hospital'
    );
  });


  test('_extraerPaciente devuelve el recurso Patient correcto', () => {
    const fhirData = {
      entry: [{ resourceType: 'Patient', resource: { id: '123', name: [{ given: ['Juan'], family: 'Pérez' }] } }],
    };
    const result = conector._extraerPaciente(fhirData);
    expect(result.name[0].given[0]).toBe('Juan');
    expect(result.name[0].family).toBe('Pérez');
  });

  test('_extraerObservaciones devuelve valores de peso, talla y superficie corporal', () => {
    const fhirData = {
      entry: [
        { resource: { resourceType: 'Observation', id: 'obs-weight', valueQuantity: { value: 70 } } },
        { resource: { resourceType: 'Observation', id: 'obs-height', valueQuantity: { value: 180 } } },
        { resource: { resourceType: 'Observation', id: 'obs-bsa', valueQuantity: { value: 1.9 } } },
      ],
    };
    const result = conector._extraerObservaciones(fhirData);
    expect(result).toEqual({ peso: 70, talla: 180, superficie_corporal: 1.9 });
  });

  test('_extraerDireccion separa calle, número y pisoDepto correctamente', () => {
    const address = [{ line: ['Av. Siempre Viva, 742, Piso 3A'] }];
    const result = conector._extraerDireccion(address);
    expect(result).toEqual({
      calle: 'Av. Siempre Viva',
      numero: '742',
      pisoDepto: '3A',
    });
  });

  test('_extraerDireccion maneja sólo piso sin letra', () => {
    const address = [{ line: ['Av. Siempre Viva, 742, Piso 3'] }];
    const result = conector._extraerDireccion(address);
    expect(result.pisoDepto).toBe('3');
  });

  test('_extraerDireccion maneja dirección sin pisoDepto correctamente', () => {
    const address = [
      {
        use: 'home',
        line: 'San Martín 1550',
        number: '1550',
        city: 'CABA',
        district: 'CABA',
        postalCode: '1824',
        country: 'AR',
      },
    ];

    const result = conector._extraerDireccion(address);

    expect(result).toEqual({
      calle: 'San Martín',
      numero: '1550',
      pisoDepto: null,
    });
  });

  test('_extraerDireccion devuelve nulls si falta la dirección', () => {
    const result = conector._extraerDireccion(null);
    expect(result).toEqual({ calle: null, numero: null, pisoDepto: null });
  });


  test('_normalizarFhir maneja valores faltantes devolviendo nulls', () => {
    const fhirDataIncompleto = { entry: [{ resourceType: 'Patient' }] };
    const resultado = conector._normalizarFhir(fhirDataIncompleto);
    expect(resultado).toEqual({
      nombre: null,
      apellido: null,
      tipo_documento: null,
      numero_documento: null,
      fecha_nacimiento: null,
      sexo: null,
      nacionalidad: null,
      domicilio_calle: null,
      domicilio_numero: null,
      domicilio_piso_depto: null,
      codigo_postal: null,
      localidad: null,
      partido: null,
      telefono: null,
      email: null,
      peso: null,
      talla: null,
      superficie_corporal: null,
      diagnostico: null,
      obra_social: null,
    });
  });

  test('obtener los datos de un profesional por su DNI', async () => {
    axios.get.mockResolvedValueOnce({
      data:JSON.stringify({
        resourceType: 'Practitioner',
        id: '19201241',
        identifier: [
          {
            system: 'DNI',
            value: '19201241'
          },
          {
            system: 'MATRICULA',
            value: 'MP12345'
          }
        ],
        specialty: {text: 'Oncología'},
        name: [{ family: 'Cacciavillano', given: ['Walter'] }],
      }),
      status: 200,
    });

    const profesional = await conector.obtenerProfesional('19201241');
    const profesionalObject = new Profesional('Walter', 'Cacciavillano', '19201241', 'MP12345', 'Oncología');

    expect(profesional).toEqual(profesionalObject);
  });

});
