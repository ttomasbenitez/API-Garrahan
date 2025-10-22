import express from 'express';
import config from '../config.js';

const app = express();

app.get('/fhir/Patient/:id', (req, res) => {
  const { id } = req.params;
  const patient = {
    resourceType: 'Patient',
    id,
    identifier: [{ system: 'http://hospital.example.org', value: id }],
    name: [{ family: 'Pérez', given: ['Juan'] }],
    gender: 'male',
    birthDate: '2017-05-15',
    generalPractitioner: [{ reference: 'Practitioner/1', display: 'Dr. María López' }]
  };
  res.json(patient);
});

app.listen(config.app.apiHospitalPort, () => {
  console.log(`FHIR mock server listening on http://mock-hospital-server:${config.app.apiHospitalPort}`);
});
