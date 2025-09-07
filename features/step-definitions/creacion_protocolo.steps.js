import { Given, When, Then } from '@cucumber/cucumber';
import request from 'supertest';
import app from '../../src/app.js';
import assert from 'node:assert/strict';

let protocolo = {};
let response;

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
  response = await request(app)
    .post(endpoint)
    .send(protocolo)
    .set('Accept', 'application/json');
});

Then('el protocolo se crea correctamente', function () {
  if (!response) throw new Error('No se recibió respuesta');
  if (response.status !== 201) throw new Error(`Status esperado 201, recibido ${response.status}`);
  assert.ok(response.body.protocolo_id);
  assert.strictEqual(response.body.nombre, protocolo.nombre);
  assert.strictEqual(response.body.enfermedad, protocolo.enfermedad);
  assert.strictEqual(response.body.linea, protocolo.linea);
});

Given(/^existe en la base de datos un protocolo con el nombre de "(.*)" con id "(.*)"$/, async function (nombreProtocolo, _idProtocolo) {
  protocolo = { nombre: nombreProtocolo, enfermedad: 'Osteosarcoma', linea: 'primera linea' };
  await request(app)
    .post('/protocolo')
    .send(protocolo)
    .set('Accept', 'application/json');
});

When(/^consulto en la API "(.*)"$/, async function (endpoint) {
  response = await request(app)
    .get(endpoint)
    .set('Accept', 'application/json');
});

Then(/^el sistema me devuelve el protocolo con id "(.*)"$/, function (id) {
  if (!response) throw new Error('No se recibió respuesta');
  if (response.status !== 200) throw new Error(`Status esperado 200, recibido ${response.status}`);
  response = JSON.parse(response.body);
  assert.strictEqual(response.protocolo_id, parseInt(id, 10));


});

Then(/^el nombre del protocolo es "(.*)"$/, function (nombre) {
  assert.strictEqual(response.nombre, nombre);

});

Then(/^la enfermedad es "(.*)"$/, function (enfermedad) {
  assert.strictEqual(response.enfermedad, enfermedad);
});

Then(/^la linea de tratamiento es "(.*)"$/, function (linea) {
  assert.strictEqual(response.linea, linea);
});
