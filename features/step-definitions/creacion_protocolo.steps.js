import { Given, When, Then } from '@cucumber/cucumber';
import request from 'supertest';
import app from '../../src/app.js';
import assert from 'node:assert/strict';

let data = {};
let response;

Given(/^quiero crear el protocolo con el nombre de "(.*)"$/, function (nombreProtocolo) {
  data.nombre = nombreProtocolo;
});

Given(/^enfermedad "(.*)"$/, function (enfermedad) {
  data.enfermedad = enfermedad;
});

Given(/^de linea de tratamiento "(.*)"$/, function (lineaTratamiento) {
  data.linea = lineaTratamiento;
});

When(/^publico en la API "(.*)" con los datos$/, async function (endpoint) {
  response = await request(app)
    .post(endpoint)
    .send(data)
    .set('Accept', 'application/json');
});

Then('el protocolo se crea correctamente', function () {
  if (!response) throw new Error('No se recibió respuesta');
  if (response.status !== 201) throw new Error(`Status esperado 201, recibido ${response.status}`);
  assert.ok(response.body.protocolo_id);
  assert.strictEqual(response.body.nombre, data.nombre);
  assert.strictEqual(response.body.enfermedad, data.enfermedad);
  assert.strictEqual(response.body.linea, data.linea);
});

Given(/^existe en la base de datos un protocolo con el nombre de "(.*)" con id "(.*)"$/, async function (nombreProtocolo, _idProtocolo) {
  data = { nombre: nombreProtocolo, enfermedad: 'Osteosarcoma', linea: 'primera linea' };
  await request(app)
    .post('/protocolo')
    .send(data)
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

Given(/^quiero agregar al protocolo con id "(.*)" un ciclo de tratamiento con los siguientes datos$/, function (idProtocolo, dataTable) {
  data = dataTable.rowsHash();
});

Then(/^el ciclo de tratamiento se agrega correctamente al protocolo "(.*)" con id "(.*)"$/,  async function (idProtocolo, idCiclo) {
  response = await request(app)
    .get('/protocolo/' + idProtocolo)
    .set('Accept', 'application/json');

  if (!response) throw new Error('No se recibió respuesta');
  if (response.status !== 200) throw new Error(`Status esperado 200, recibido ${response.status}`);
  response = JSON.parse(response.body);
  assert.strictEqual(response.protocolo_id, parseInt(idProtocolo, 10));
  assert.ok(response.ciclos);
  const ciclo = response.ciclos.find(c => c.id === parseInt(idCiclo, 10));
  if (!ciclo) throw new Error(`No se encontró el ciclo con id ${idCiclo} en el protocolo ${idProtocolo}`);
  assert.strictEqual(Number(ciclo.regimen), Number(data.regimen));
  assert.strictEqual(Number(ciclo.duracion_semanas), Number(data.duracion_semanas));
  assert.strictEqual(String(ciclo.ciclo_final), data.ciclo_final);
});

