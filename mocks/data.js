
export const PACIENTES_BY_ID_HOSPITALARIO = {
  'H001': {
    resourceType: 'Bundle',
    type: 'collection',
    entry: [{
      resourceType: 'Patient',
      id: 'H001',
      identifier: [
        { system: 'http://garrahan.example.org', value: 'H001' },
        { system: 'DNI', value: '87654321' },
      ],
      name: [{ family: 'Esposito', given: ['Juan'] }],
      gender: 'M',
      birthDate: '2018-03-20',
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
      generalPractitioner: [{ reference: 'Practitioner/MP12346', display: 'Dr. Fernando Gómez' }],
    },
    {
      resource: {
        resourceType: 'Coverage',
        id: 'cov1',
        beneficiary: { 'reference': 'Patient/H001' },
        payor: [{ 'display': 'IOMA' }],
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
        subject: { 'reference': 'Patient/H001' }
      }
    },
    {
      resource: {
        resourceType: 'Observation',
        id: 'obs-weight',
        status: 'final',
        subject: { 'reference': 'Patient/H001' },
        valueQuantity: { 'value': 30.0, 'unit': 'kg', 'code': 'kg' }
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
        subject: { 'reference': 'Patient/H001' },
        valueQuantity: { 'value': 1.0583, 'unit': 'm2', 'code': 'm2' }
      }
    }
    ]
  },
  'H002': {
    resourceType: 'Bundle',
    type: 'collection',
    entry: [{
      resourceType: 'Patient',
      id: 'H002',
      identifier: [
        { system: 'http://garrahan.example.org', value: 'H002' },
        { system: 'DNI', value: '12345678' },
      ],
      name: [{ family: 'Pérez', given: ['Maria'] }],
      gender: 'F',
      birthDate: '2020-05-12',
      telecom: [
        { system: 'phone', value: '+54-11-6666-5555', use: 'mobile' },
        { system: 'email', value: 'maria.perez@example.org' }
      ],
      address: [
        {
          use: 'home',
          line: 'Av. 9 de julio, 1090, Piso 3B',
          number: '1090',
          city: 'CABA',
          district: 'CABA',
          postalCode: '1790',
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
      generalPractitioner: [{ reference: 'Practitioner/MP12345', display: 'Dr. Walter Cacciavillano' }],
    },
    {
      resource: {
        resourceType: 'Coverage',
        id: 'cov1',
        beneficiary: { 'reference': 'Patient/H002' },
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
        subject: { 'reference': 'Patient/H002' }
      }
    },
    {
      resource: {
        resourceType: 'Observation',
        id: 'obs-weight',
        status: 'final',
        subject: { 'reference': 'Patient/H002' },
        valueQuantity: { 'value': 30.5, 'unit': 'kg', 'code': 'kg' }
      }
    },
    {
      resource: {
        resourceType: 'Observation',
        id: 'obs-height',
        status: 'final',
        subject: { 'reference': 'Patient/H002' },
        valueQuantity: { 'value': 120.0, 'unit': 'cm', 'code': 'cm' }
      }
    },
    {
      resource: {
        resourceType: 'Observation',
        id: 'obs-bsa',
        status: 'final',
        subject: { 'reference': 'Patient/H002' },
        valueQuantity: { 'value': 1.070539419087137, 'unit': 'm2', 'code': 'm2' }
      }
    }
    ]
  },
  'H003': {
    resourceType: 'Bundle',
    type: 'collection',
    entry: [{
      resourceType: 'Patient',
      id: 'H003',
      identifier: [
        { system: 'http://garrahan.example.org', value: 'H003' },
        { system: 'DNI', value: '51223344' },
      ],
      name: [{ family: 'Garcia', given: ['Ana'] }],
      gender: 'F',
      birthDate: '2019-07-15',
      telecom: [
        { system: 'phone', value: '+54-11-6666-7777', use: 'mobile' },
        { system: 'email', value: 'ana.maria@example.org' }
      ],
      address: [
        {
          use: 'home',
          line: 'Bahia Blanca, 1075',
          number: '1075',
          city: 'Wilde',
          district: 'Wilde',
          postalCode: '1875',
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
      generalPractitioner: [{ reference: 'Practitioner/MP12345', display: 'Dr. Walter Cacciavillano' }],
    },
    {
      resource: {
        resourceType: 'Coverage',
        id: 'cov1',
        beneficiary: { 'reference': 'Patient/H003' },
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
        subject: { 'reference': 'Patient/H003' }
      }
    },
    {
      resource: {
        resourceType: 'Observation',
        id: 'obs-weight',
        status: 'final',
        subject: { 'reference': 'Patient/H002' },
        valueQuantity: { 'value': 28.0, 'unit': 'kg', 'code': 'kg' }
      }
    },
    {
      resource: {
        resourceType: 'Observation',
        id: 'obs-height',
        status: 'final',
        subject: { 'reference': 'Patient/H003' },
        valueQuantity: { 'value': 120.0, 'unit': 'cm', 'code': 'cm' }
      }
    },
    {
      resource: {
        resourceType: 'Observation',
        id: 'obs-bsa',
        status: 'final',
        subject: { 'reference': 'Patient/H003' },
        valueQuantity: { 'value': 1.0084, 'unit': 'm2', 'code': 'm2' }
      }
    }
    ]
  },
};
