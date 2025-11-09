import express from 'express';
import config from '../config.js';

const app = express();

app.get('/fhir/Patient/:id', (req, res) => {
  const { id } = req.params;
  const patient = {
    resourceType: 'Bundle',
    type: 'collection',
    entry: [{
      resourceType: 'Patient',
      id,
      identifier: [
        { system: 'http://garrahan.example.org', value: id },
        { system: 'DNI', value: '12345678' },
      ],
      name: [{ family: 'Pérez', given: ['Juan'] }],
      gender: 'male',
      birthDate: '2017-05-15',
      telecom: [
        { system: 'phone', value: '+54-11-5555-5555', use: 'mobile' },
        { system: 'email', value: 'juan.perez@example.org' }
      ],
      address: [
        {
          use: 'home',
          line: 'Av. Calchaqui, 1090, Piso 3B',
          number: '1090',
          city: 'Quilmes Oeste',
          district: 'Quilmes',
          postalCode: '1414',
          country: 'AR'
        }
      ],
      extension: [
        {
          valueCodeableConcept: {
            coding: [
              {
                system: 'urn:iso:std:iso:3166',
                code: 'AR',
                display: 'Argentina'
              }
            ],
            text: 'Argentina'
          }
        }
      ],
      generalPractitioner: [{ reference: 'Practitioner/1', display: 'Dr. María López' }],
    },
    {
      resource: {
        resourceType: 'Coverage',
        id: 'cov1',
        beneficiary: { 'reference': 'Patient/123' },
        payor: [{ 'display': 'OSDE' }],
        status: 'active'
      }
    },
    {
      resource: {
        resourceType: 'Condition',
        id: 'cond-1',
        code: {
          'text': 'Leucemia linfoblástica aguda'
        },
        subject: { 'reference': 'Patient/123' }
      }
    },
    {
      resource: {
        resourceType: 'Observation',
        id: 'obs-weight',
        status: 'final',
        subject: { 'reference': 'Patient/123' },
        valueQuantity: { 'value': 18.2, 'unit': 'kg', 'code': 'kg' }
      }
    },
    {
      resource: {
        resourceType: 'Observation',
        id: 'obs-height',
        status: 'final',
        subject: { 'reference': 'Patient/123' },
        valueQuantity: { 'value': 110.0, 'unit': 'cm', 'code': 'cm' }
      }
    },
    {
      resource: {
        resourceType: 'Observation',
        id: 'obs-bsa',
        status: 'final',
        subject: { 'reference': 'Patient/123' },
        valueQuantity: { 'value': 0.78, 'unit': 'm2', 'code': 'm2' }
      }
    }
    ]
  };
  res.json(patient);
});

app.get('/fhir/Patient', (req, res) => {
  const patient = {
    resourceType: 'Bundle',
    type: 'collection',
    entry: [{
      resourceType: 'Patient',
      id: 123,
      identifier: [
        { system: 'http://garrahan.example.org', value: 123 },
        { system: 'DNI', value: '12345678' },
      ],
      name: [{ family: 'Pérez', given: ['Juan'] }],
      gender: 'male',
      birthDate: '2017-05-15',
      telecom: [
        { system: 'phone', value: '+54-11-5555-5555', use: 'mobile' },
        { system: 'email', value: 'juan.perez@example.org' }
      ],
      address: [
        {
          use: 'home',
          line: 'Av. Calchaqui, 1090, Piso 3B',
          number: '1090',
          city: 'Quilmes Oeste',
          district: 'Quilmes',
          postalCode: '1414',
          country: 'AR'
        }
      ],
      extension: [
        {
          valueCodeableConcept: {
            coding: [
              {
                system: 'urn:iso:std:iso:3166',
                code: 'AR',
                display: 'Argentina'
              }
            ],
            text: 'Argentina'
          }
        }
      ],
      generalPractitioner: [{ reference: 'Practitioner/1', display: 'Dr. María López' }],
    },
    {
      resource: {
        resourceType: 'Coverage',
        id: 'cov1',
        beneficiary: { 'reference': 'Patient/123' },
        payor: [{ 'display': 'OSDE' }],
        status: 'active'
      }
    },
    {
      resource: {
        resourceType: 'Condition',
        id: 'cond-1',
        code: {
          'text': 'Leucemia linfoblástica aguda'
        },
        subject: { 'reference': 'Patient/123' }
      }
    },
    {
      resource: {
        resourceType: 'Observation',
        id: 'obs-weight',
        status: 'final',
        subject: { 'reference': 'Patient/123' },
        valueQuantity: { 'value': 18.2, 'unit': 'kg', 'code': 'kg' }
      }
    },
    {
      resource: {
        resourceType: 'Observation',
        id: 'obs-height',
        status: 'final',
        subject: { 'reference': 'Patient/123' },
        valueQuantity: { 'value': 110.0, 'unit': 'cm', 'code': 'cm' }
      }
    },
    {
      resource: {
        resourceType: 'Observation',
        id: 'obs-bsa',
        status: 'final',
        subject: { 'reference': 'Patient/123' },
        valueQuantity: { 'value': 0.78, 'unit': 'm2', 'code': 'm2' }
      }
    }
    ]
  };

  res.json([patient]);
});

app.listen(config.app.apiHospitalPort, () => {
  console.log(`FHIR mock server listening on http://mock-hospital-server:${config.app.apiHospitalPort}`);
});
