import { Given, When, Then } from '@cucumber/cucumber';
import request from 'supertest';
import app from '../../src/app.js';

const protocolo = {};

Given(/^quiero crear el protocolo con el nombre de "(.*)"$/, function (nombreProtocolo) {
  protocolo.nombre = nombreProtocolo;
});

Given(/^enfermedad "(.*)"$/, function (enfermedad) {
  protocolo.enfermedad = enfermedad;
});

Given(/^de linea de tratamiento "(.*)"$/, function (lineaTratamiento) {
  protocolo.linea = lineaTratamiento;
});

When(/^publico en la API "(.*)" con los datos$/, async function (endpoint) {
  const response = await request(app)
    .post(endpoint)
    .send(protocolo)
    .set('Accept', 'application/json');
  this.response = response;
  protocolo.id = response.body.protocolo_id;
});

Then('el protocolo se crea correctamente', function () {
  const response = this.response;
  if (!response) throw new Error('No se recibió respuesta');
  if (response.status !== 201) throw new Error(`Status esperado 201, recibido ${response.status}`);
  if (!response.body.protocolo_id) throw new Error('No se recibió protocolo_id');
});
