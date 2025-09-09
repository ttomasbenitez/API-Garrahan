import { Given, When, Then } from '@cucumber/cucumber';
import request from 'supertest';
import app from '../../src/app.js';
import assert from 'node:assert/strict';

let droga = {};
let response;

Given(/^que tengo los siguientes datos de la droga:$/, function (dataTable) {
  droga = dataTable.rowsHash();
});

When(/^publico en la API "(.*)" con los datos de la droga$/, async function (endpoint) {
  response = await request(app)
    .post(endpoint)
    .send(droga)
    .set('Accept', 'application/json');
});

Then(/^obtengo los datos de la droga con el id "(.*)"$/, function (id) {
  assert.ok(response);
  assert.strictEqual(response.status, 201);
  assert.ok(response.body.id_droga);
  assert.strictEqual(response.body.id_droga, parseInt(id, 10));

});

Then(/^el medicamento es "(.*)"$/, function (nombreMedicamento) {
  assert.strictEqual(response.body.medicamento, nombreMedicamento);
});

Then(/^la "(.*)" es "(.*)"$/, function (campo, valor) {
  assert.strictEqual(response.body[campo], valor);
});
