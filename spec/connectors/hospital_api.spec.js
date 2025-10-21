/* global describe, test, expect, jest, beforeEach */
import { ApiHospitalConector } from '../../src/connectors/hospital_api.js';
import config from '../../config.js';

describe('ApiHospitalConector', () => {
  let conector;

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn(); // mock del fetch nativo
    config.app = { apiHospitalUrl: 'http://fake-hospital.com' };
    conector = new ApiHospitalConector();
  });

  test('obtenerPaciente devuelve datos normalizados correctamente', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        resourceType: 'Patient',
        id: '123',
        identifier: [{ system: 'http://hospital.example.org', value: 'P12345' }],
        name: [{ family: 'Pérez', given: ['Juan'] }],
        gender: 'male',
        birthDate: '2017-05-15',
        generalPractitioner: [{ reference: 'Practitioner/1', display: 'Dr. María López' }]
      })
    };
    global.fetch.mockResolvedValue(mockResponse);

    const paciente = await conector.obtenerPaciente('123');

    expect(global.fetch).toHaveBeenCalledWith('http://fake-hospital.com/fhir/Patient/123');
    expect(paciente).toEqual({
      nombre: 'Juan',
      apellido: 'Pérez',
      id_hospitalario: 'P12345',
      fecha_nacimiento: '2017-05-15',
      sexo: 'M',
    });
  });
});
