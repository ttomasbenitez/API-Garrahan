/* global describe, test, expect, jest, beforeEach */
import { ApiHospitalConector } from '../../src/connectors/hospital_api.js';
import config from '../../config.js';

describe('ApiHospitalConector', () => {
  let conector;

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
    config.app = { apiHospitalUrl: 'http://fake-hospital-api.com' };
    conector = new ApiHospitalConector();
  });

  test('obtenerPaciente devuelve datos normalizados correctamente', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
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
        }]
      })
    };

    global.fetch.mockResolvedValue(mockResponse);

    const paciente = await conector.obtenerPaciente('123');

    expect(global.fetch).toHaveBeenCalledWith('http://fake-hospital-api.com/fhir/Patient/123');
    expect(paciente).toEqual({
      nombre: 'Juan',
      apellido: 'Pérez',
      tipo_documento: 'DNI',
      numero_documento: '12345678',
      fecha_nacimiento: '2017-05-15',
      sexo: 'M',
      nacionalidad: 'Argentina',
      domicilio_calle: 'Av. Calchaqui, 1090, Piso 3B',
      domicilio_numero: '1090',
      domicilio_piso_depto: 'Piso 3B',
      codigo_postal: '1414',
      localidad: 'Quilmes Oeste',
      partido: 'Quilmes',
      telefono: '+54-11-5555-5555',
      email: 'juan.perez@example.org',
      peso: 18.2,
      talla: 110.0,
      superficie_corporal: 0.78,
      diagnostico: 'Leucemia linfoblástica aguda'
    });
  });

  test('lanza error si la respuesta no es ok', async () => {
    global.fetch.mockResolvedValue({ ok: false });
    await expect(conector.obtenerPaciente('999'))
      .rejects.toThrow('Error al consultar la API del hospital');
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
      diagnostico: null
    });
  });

  test('lanza error si fetch falla por error de red', async () => {
    global.fetch.mockRejectedValue(new Error('Network error'));

    await expect(conector.obtenerPaciente('500'))
      .rejects.toThrow('Network error');
  });
});
