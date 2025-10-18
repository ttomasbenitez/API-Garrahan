import { Given, When, Then } from '@cucumber/cucumber';
import request from 'supertest';
import app from '../../src/app.js';
import assert from 'node:assert/strict';

let formas = [];
let response;

Given(/^que tengo los siguientes datos de la forma farmacéutica:$/, function (dataTable) {
  const data = dataTable.rowsHash();
  formas.push(data);
});

When(/^publico en la API de forma farmaceutica "(.*)" con los datos de la forma$/, async function (endpoint) {
  response = await request(app)
    .post(endpoint)
    .send(formas)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
});

When(/^publico en la API de forma farmaceutica "(.*)" con los datos de las formas$/, async function (endpoint) {
  response = await request(app)
    .post(endpoint)
    .send(formas)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
});

Then(/^el campo "(.*)" de la forma farmaceutica es "(.*)"$/, function (campo, valor) {
  const body = Array.isArray(response.body) ? response.body[0] : response.body;
  assert.strictEqual(String(body[campo]), String(valor));
});

Then(/^se crea correctamente la forma farmaceutica$/, function () {
  formas = [];
  assert.ok(response);
  assert.strictEqual(response.status, 201);
  response = {};
});

Then(/^obtengo los datos de las formas con el id "(.*)" y "(.*)"$/, function (id1, id2) {
  assert.ok(Array.isArray(response.body));
  assert.strictEqual(response.body.length, 2);
  assert.ok(response.body[0].forma_farmaceutica_id);
  assert.ok(response.body[1].forma_farmaceutica_id);
  assert.strictEqual(response.body[0].forma_farmaceutica_id, parseInt(id1, 10));
  assert.strictEqual(response.body[1].forma_farmaceutica_id, parseInt(id2, 10));
});

When(/^consulto en la API de forma farmaceutica "(.*)" por su id$/, async function (endpoint) {
  response = await request(app)
    .get(endpoint)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
});

Then(/^el sistema me devuelve la forma farmacéutica con id "(.*)"$/, function (id) {
  assert.ok(response);
  assert.strictEqual(response.status, 200);
  assert.ok(response.body.forma_farmaceutica_id);
  assert.strictEqual(response.body.forma_farmaceutica_id, parseInt(id, 10));
});

Then(/^el campo "(.*)" es "(.*)" en la forma farmaceutica$/, function (campo, valor) {
  assert.strictEqual(String(response.body[campo]), String(valor));
});

When(/^consulto en la API de forma farmaceutica "(.*)"$/, async function (endpoint) {
  response = await request(app)
    .get(endpoint)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
});

Then(/^el sistema me devuelve una lista con (\d+) formas farmacéuticas en la consulta$/, function (cantidad) {
  assert.ok(Array.isArray(response.body));
  assert.strictEqual(response.body.length, parseInt(cantidad, 10));
});

Then(/^el primer registro de forma farmaceutica tiene "(.*)" = "(.*)" y "(.*)" = "(.*)"$/, function (campo1, valor1, campo2, valor2) {
  assert.strictEqual(String(response.body[0][campo1]), String(valor1));
  assert.strictEqual(String(response.body[0][campo2]), String(valor2));
});

Then(/^el segundo registro de forma farmaceutica tiene "(.*)" = "(.*)" y "(.*)" = "(.*)"$/, function (campo1, valor1, campo2, valor2) {
  assert.strictEqual(String(response.body[1][campo1]), String(valor1));
  assert.strictEqual(String(response.body[1][campo2]), String(valor2));
});

When(/^publico en la API de forma farmaceutica "(.*)" con los siguientes datos:$/, async function (endpoint, dataTable) {
  const data = dataTable.rowsHash();
  response = await request(app)
    .put(endpoint)
    .send(data)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
});

Then(/^el campo "(.*)" es "(.*)" en la respuesta de forma farmaceutica$/, function (campo, valor) {
  assert.strictEqual(String(response.body[campo]), String(valor));
});

Then(/^se actualiza correctamente la forma farmaceutica$/, function () {
  assert.ok(response);
  assert.strictEqual(response.status, 200);
  response = {};
});
