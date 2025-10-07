import { Given, When, Then } from '@cucumber/cucumber';
import request from 'supertest';
import app from '../../src/app.js';
import assert from 'node:assert/strict';

let datosAdmin = [];
let response = {};

Given('que tengo los siguientes datos de la vía de administración:', function (dataTable) {
  datosAdmin = [dataTable.rowsHash()].map((row) => {
    return {
      nombre: row.nombre,
      codigo: row.codigo,
    };
  });
});

When(/^publico la API "(.*)" con los datos de la vía$/, async function (endpoint) {
  response = await request(app)
    .post(endpoint)
    .send(datosAdmin)
    .set('Accept', 'application/json');
});

Then(/^el "(.*)" de la via es "(.*)"$/, function (key, valor) {
  const body = response.body;
  const via = body[0];
  assert.strictEqual(via[key], valor);
});

Then('se crea correctamente la vía de administración', function () {
  assert.ok(response);
  assert.strictEqual(response.status, 201);
  datosAdmin = [];
  response = {};
});

