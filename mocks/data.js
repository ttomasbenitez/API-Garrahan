
export const PACIENTES_BY_ID_HOSPITALARIO = {
  'H001': {
    resourceType: 'Bundle',
    type: 'collection',
    entry: [{
      resourceType: 'Patient',
      id: 'H001',
      identifier: [
        { system: 'http://garrahan.example.org', value: 'H001' },
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
        beneficiary: { 'reference': 'Patient/H001' },
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
        subject: { 'reference': 'Patient/H001' }
      }
    },
    {
      resource: {
        resourceType: 'Observation',
        id: 'obs-weight',
        status: 'final',
        subject: { 'reference': 'Patient/H001' },
        valueQuantity: { 'value': 30.5, 'unit': 'kg', 'code': 'kg' }
      }
    },
    {
      resource: {
        resourceType: 'Observation',
        id: 'obs-height',
        status: 'final',
        subject: { 'reference': 'Patient/H001' },
        valueQuantity: { 'value': 120.0, 'unit': 'cm', 'code': 'cm' }
      }
    },
    {
      resource: {
        resourceType: 'Observation',
        id: 'obs-bsa',
        status: 'final',
        subject: { 'reference': 'Patient/H001' },
        valueQuantity: { 'value': 1.070539419087137, 'unit': 'm2', 'code': 'm2' }
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
        { system: 'DNI', value: '87654321' },
      ],
      name: [{ family: 'Palermo', given: ['Martin'] }],
      gender: 'M',
      birthDate: '2018-03-20',
      telecom: [
        { system: 'phone', value: '+54-11-5555-5555', use: 'mobile' },
        { system: 'email', value: 'martin.palermo@example.org' }
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
        beneficiary: { 'reference': 'Patient/H002' },
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
        subject: { 'reference': 'Patient/H002' }
      }
    },
    {
      resource: {
        resourceType: 'Observation',
        id: 'obs-weight',
        status: 'final',
        subject: { 'reference': 'Patient/H002' },
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
        subject: { 'reference': 'Patient/H002' },
        valueQuantity: { 'value': 1.0583, 'unit': 'm2', 'code': 'm2' }
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
        subject: { 'reference': 'Patient/H001' },
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
  'H004': {
    resourceType: 'Bundle',
    type: 'collection',
    entry: [{
      resourceType: 'Patient',
      id: 'H004',
      identifier: [
        { system: 'http://garrahan.example.org', value: 'H004' },
        { system: 'DNI', value: '33445566' },
      ],
      name: [{ family: 'Lopez', given: ['Santiago'] }],
      gender: 'M',
      birthDate: '2017-01-10',
      telecom: [
        { system: 'phone', value: '+54-11-4555-9999', use: 'mobile' },
        { system: 'email', value: 'santiago.lopez@example.org' }
      ],
      address: [
        { use: 'home', line: 'Av. Mitre 2010', number: '2010', city: 'Avellaneda', district: 'Avellaneda', postalCode: '1870', country: 'AR' }
      ],
      extension: [{
        valueCodeableConcept: { coding: [{ system: 'urn:iso:std:iso:3166', code: 'AR', display: 'Argentina' }], text: 'Argentina' }
      }],
      generalPractitioner: [{ reference: 'Practitioner/MP12347', display: 'Dr. Laura Gimenez' }],
    },
    { resource: { resourceType: 'Coverage', id: 'cov1', beneficiary: { reference: 'Patient/H004' }, payor: [{ display: 'Swiss Medical' }], status: 'active' } },
    { resource: { resourceType: 'Condition', id: 'cond-1', code: { text: 'Anemia aplásica' }, subject: { reference: 'Patient/H004' } } },
    { resource: { resourceType: 'Observation', id: 'obs-weight', status: 'final', subject: { reference: 'Patient/H004' }, valueQuantity: { value: 25.0, unit: 'kg', code: 'kg' } } },
    { resource: { resourceType: 'Observation', id: 'obs-height', status: 'final', subject: { reference: 'Patient/H004' }, valueQuantity: { value: 115.0, unit: 'cm', code: 'cm' } } },
    { resource: { resourceType: 'Observation', id: 'obs-bsa', status: 'final', subject: { reference: 'Patient/H004' }, valueQuantity: { value: 0.97, unit: 'm2', code: 'm2' } } }
    ]
  },

  'H005': {
    resourceType: 'Bundle',
    type: 'collection',
    entry: [{
      resourceType: 'Patient',
      id: 'H005',
      identifier: [
        { system: 'http://garrahan.example.org', value: 'H005' },
        { system: 'DNI', value: '44778899' },
      ],
      name: [{ family: 'Martinez', given: ['Lucia'] }],
      gender: 'F',
      birthDate: '2021-09-05',
      telecom: [
        { system: 'phone', value: '+54-11-4222-3333', use: 'mobile' },
        { system: 'email', value: 'lucia.martinez@example.org' }
      ],
      address: [
        { use: 'home', line: 'San Martín 1550', number: '1550', city: 'CABA', district: 'CABA', postalCode: '1824', country: 'AR' }
      ],
      extension: [{
        valueCodeableConcept: { coding: [{ system: 'urn:iso:std:iso:3166', code: 'AR', display: 'Argentina' }], text: 'Argentina' }
      }],
      generalPractitioner: [{ reference: 'Practitioner/MP12349', display: 'Dr. Diego López' }],
    },
    { resource: { resourceType: 'Coverage', id: 'cov1', beneficiary: { reference: 'Patient/H005' }, payor: [{ display: 'Galeno' }], status: 'active' } },
    { resource: { resourceType: 'Condition', id: 'cond-1', code: { text: 'Linfoma de Hodgkin' }, subject: { reference: 'Patient/H005' } } },
    { resource: { resourceType: 'Observation', id: 'obs-weight', status: 'final', subject: { reference: 'Patient/H005' }, valueQuantity: { value: 18.2, unit: 'kg', code: 'kg' } } },
    { resource: { resourceType: 'Observation', id: 'obs-height', status: 'final', subject: { reference: 'Patient/H005' }, valueQuantity: { value: 100.0, unit: 'cm', code: 'cm' } } },
    { resource: { resourceType: 'Observation', id: 'obs-bsa', status: 'final', subject: { reference: 'Patient/H005' }, valueQuantity: { value: 0.76, unit: 'm2', code: 'm2' } } }
    ]
  },

  'H006': {
    resourceType: 'Bundle',
    type: 'collection',
    entry: [{
      resourceType: 'Patient',
      id: 'H006',
      identifier: [
        { system: 'http://garrahan.example.org', value: 'H006' },
        { system: 'DNI', value: '55667788' },
      ],
      name: [{ family: 'Romero', given: ['Joaquin'] }],
      gender: 'M',
      birthDate: '2015-11-02',
      telecom: [
        { system: 'phone', value: '+54-11-4999-8877', use: 'mobile' },
        { system: 'email', value: 'joaquin.romero@example.org' }
      ],
      address: [
        { use: 'home', line: 'Belgrano 221', number: '221', city: 'Temperley', district: 'Lomas de Zamora', postalCode: '1834', country: 'AR' }
      ],
      extension: [{
        valueCodeableConcept: { coding: [{ system: 'urn:iso:std:iso:3166', code: 'AR', display: 'Argentina' }], text: 'Argentina' }
      }],
      generalPractitioner: [{ reference: 'Practitioner/MP12352', display: 'Dra. Paula Costa' }],
    },
    { resource: { resourceType: 'Coverage', id: 'cov1', beneficiary: { reference: 'Patient/H006' }, payor: [{ display: 'IOMA' }], status: 'active' } },
    { resource: { resourceType: 'Condition', id: 'cond-1', code: { text: 'Tumor cerebral' }, subject: { reference: 'Patient/H006' } } },
    { resource: { resourceType: 'Observation', id: 'obs-weight', status: 'final', subject: { reference: 'Patient/H006' }, valueQuantity: { value: 35.0, unit: 'kg', code: 'kg' } } },
    { resource: { resourceType: 'Observation', id: 'obs-height', status: 'final', subject: { reference: 'Patient/H006' }, valueQuantity: { value: 130.0, unit: 'cm', code: 'cm' } } },
    { resource: { resourceType: 'Observation', id: 'obs-bsa', status: 'final', subject: { reference: 'Patient/H006' }, valueQuantity: { value: 1.16, unit: 'm2', code: 'm2' } } }
    ]
  },

  'H007': {
    resourceType: 'Bundle',
    type: 'collection',
    entry: [{
      resourceType: 'Patient',
      id: 'H007',
      identifier: [
        { system: 'http://garrahan.example.org', value: 'H007' },
        { system: 'DNI', value: '66778899' },
      ],
      name: [{ family: 'Suarez', given: ['Micaela'] }],
      gender: 'F',
      birthDate: '2016-08-18',
      telecom: [
        { system: 'phone', value: '+54-11-4666-9900', use: 'mobile' },
        { system: 'email', value: 'micaela.suarez@example.org' }
      ],
      address: [
        { use: 'home', line: 'Av. Eva Perón 155', number: '155', city: 'Merlo', district: 'San Luis', postalCode: '1884', country: 'AR' }
      ],
      extension: [{
        valueCodeableConcept: { coding: [{ system: 'urn:iso:std:iso:3166', code: 'AR', display: 'Argentina' }], text: 'Argentina' }
      }],
      generalPractitioner: [{ reference: 'Practitioner/MP12353', display: 'Dr. Hernán Alvarez' }],
    },
    { resource: { resourceType: 'Coverage', id: 'cov1', beneficiary: { reference: 'Patient/H007' }, payor: [{ display: 'Medicus' }], status: 'active' } },
    { resource: { resourceType: 'Condition', id: 'cond-1', code: { text: 'Neuroblastoma' }, subject: { reference: 'Patient/H007' } } },
    { resource: { resourceType: 'Observation', id: 'obs-weight', status: 'final', subject: { reference: 'Patient/H007' }, valueQuantity: { value: 27.5, unit: 'kg', code: 'kg' } } },
    { resource: { resourceType: 'Observation', id: 'obs-height', status: 'final', subject: { reference: 'Patient/H007' }, valueQuantity: { value: 118.0, unit: 'cm', code: 'cm' } } },
    { resource: { resourceType: 'Observation', id: 'obs-bsa', status: 'final', subject: { reference: 'Patient/H007' }, valueQuantity: { value: 1.03, unit: 'm2', code: 'm2' } } }
    ]
  },

  'H008': {
    resourceType: 'Bundle',
    type: 'collection',
    entry: [{
      resourceType: 'Patient',
      id: 'H008',
      identifier: [
        { system: 'http://garrahan.example.org', value: 'H008' },
        { system: 'DNI', value: '77889900' },
      ],
      name: [{ family: 'Fernandez', given: ['Camilo'] }],
      gender: 'M',
      birthDate: '2014-02-28',
      telecom: [
        { system: 'phone', value: '+54-11-4777-2233', use: 'mobile' },
        { system: 'email', value: 'camilo.fernandez@example.org' }
      ],
      address: [
        { use: 'home', line: 'Av. Rivadavia 4000', number: '4000', city: 'CABA', district: 'Almagro', postalCode: '1205', country: 'AR' }
      ],
      extension: [{
        valueCodeableConcept: { coding: [{ system: 'urn:iso:std:iso:3166', code: 'AR', display: 'Argentina' }], text: 'Argentina' }
      }],
      generalPractitioner: [{ reference: 'Practitioner/MP12354', display: 'Dra. Julieta Ramos' }],
    },
    { resource: { resourceType: 'Coverage', id: 'cov1', beneficiary: { reference: 'Patient/H008' }, payor: [{ display: 'OSDE' }], status: 'active' } },
    { resource: { resourceType: 'Condition', id: 'cond-1', code: { text: 'Leucemia mieloide crónica' }, subject: { reference: 'Patient/H008' } } },
    { resource: { resourceType: 'Observation', id: 'obs-weight', status: 'final', subject: { reference: 'Patient/H008' }, valueQuantity: { value: 38.4, unit: 'kg', code: 'kg' } } },
    { resource: { resourceType: 'Observation', id: 'obs-height', status: 'final', subject: { reference: 'Patient/H008' }, valueQuantity: { value: 135.0, unit: 'cm', code: 'cm' } } },
    { resource: { resourceType: 'Observation', id: 'obs-bsa', status: 'final', subject: { reference: 'Patient/H008' }, valueQuantity: { value: 1.22, unit: 'm2', code: 'm2' } } }
    ]
  },
};

export const PROFESIONALES_BY_DNI = {
  '19201241': {
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
  },
  '21201241': {
    resourceType: 'Practitioner',
    id: '21201241',
    identifier: [
      {
        system: 'DNI',
        value: '21201241'
      },
      {
        system: 'MATRICULA',
        value: 'MP12346'
      }
    ],
    specialty: {text: 'Pediatría'},
    name: [{ family: 'Gómez', given: ['Fernando'] }],
  }
};
