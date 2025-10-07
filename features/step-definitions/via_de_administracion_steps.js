import { Given, When, Then } from '@cucumber/cucumber';
import request from 'supertest';
import app from '../../src/app.js';
import assert from 'node:assert/strict';

let datosAdmin = [];
let response = {};

Given('que tengo los siguientes datos de la vía de administración:', function (dataTable) {
  [dataTable.rowsHash()].forEach((row) => {
    datosAdmin.push({
      nombre: row.nombre,
      codigo: row.codigo,
    });
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
  response = null;
});

const compararVia = (via1, via2) => {
  assert.strictEqual(via1.nombre, via2.nombre);
  assert.strictEqual(via1.codigo, via2.codigo);
};

Then('obtengo los datos de las vías con el id {string} y {string}', function (id1, id2) {
  const body = response.body;
  const via1 = body[0];
  const via2 = body[1];
  compararVia(via1, datosAdmin[0]);
  compararVia(via2,datosAdmin[1]);
  assert.strictEqual(via1.via_id, Number(id1));
  assert.strictEqual(via2.via_id, Number(id2));
});
