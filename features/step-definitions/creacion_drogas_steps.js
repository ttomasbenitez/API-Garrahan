import { Given, When, Then } from '@cucumber/cucumber';
import request from 'supertest';
import app from '../../src/app.js';
import assert from 'node:assert/strict';

let droga = [];
let response;

Given(/^que tengo los siguientes datos de la droga:$/, function (dataTable) {
  const data = dataTable.rowsHash();
  droga.push(data);
});

When(/^publico en la API "(.*)" con los datos de la droga$/, async function (endpoint) {
  response = await request(app)
    .post(endpoint)
    .send(droga)
    .set('Accept', 'application/json');
});

Then(/^obtengo los datos de la droga con el id "(.*)"$/, function (id) {
  assert.ok(response.body[0].id_droga);
  assert.strictEqual(response.body[0].id_droga, parseInt(id, 10));

});

Then(/^el medicamento es "(.*)"$/, function (nombreMedicamento) {
  const body = Array.isArray(response.body) ? response.body[0] : response.body;
  assert.strictEqual(body.medicamento, nombreMedicamento);
});

Then(/^la "(.*)" es "(.*)"$/, function (campo, valor) {
  const body = Array.isArray(response.body) ? response.body[0] : response.body;
  assert.strictEqual(String(body[campo]), String(valor));
});

const compararDroga = (droga1, droga2) => {
  assert.strictEqual(droga1.medicamento, droga2.medicamento);
  assert.strictEqual(droga1.presentacion, droga2.presentacion);
  assert.strictEqual(String(droga1.dosis), String(droga2.dosis));
  assert.strictEqual(String(droga1.dosis_unidad), String(droga2.dosis_unidad));
  assert.strictEqual(String(droga1.dosis_maxima), String(droga2.dosis_maxima));
  assert.strictEqual(String(droga1.dosis_maxima_unidad), String(droga2.dosis_maxima_unidad));
};

Then(/^obtengo los datos de las Drogas con el id "(.*)" y "(.*)"$/, function (id1, id2) {
  assert.ok(Array.isArray(response.body));
  assert.strictEqual(response.body.length, 2);
  assert.ok(response.body[0].id_droga);
  assert.ok(response.body[1].id_droga);
  assert.strictEqual(response.body[0].id_droga, parseInt(id1, 10));
  assert.strictEqual(response.body[1].id_droga, parseInt(id2, 10));
  compararDroga(response.body[0], droga[0]);
  compararDroga(response.body[1], droga[1]);
});

Then('responde correctamente', function () {
  droga = [];
  assert.ok(response);
  assert.strictEqual(response.status, 200);
  response = {};
});

Then('se crea correctamente', function () {
  droga = [];
  assert.ok(response);
  assert.strictEqual(response.status, 201);
  response = {};
});

Given(/^su id es "(.*)"$/, async function (_id) {
  response = await request(app)
    .post('/droga')
    .send(droga)
    .set('Accept', 'application/json');
});

When(/^consulto en la API "(.*)" por su id$/, async function (endpoint) {
  response = await request(app)
    .get(endpoint)
    .set('Accept', 'application/json');
});

Then(/^el sistema me devuelve la droga con id "(.*)"$/, function (id) {
  assert.ok(response);
  assert.strictEqual(response.status, 200);
  assert.ok(response.body.id_droga);
  assert.strictEqual(response.body.id_droga, parseInt(id, 10));
});
