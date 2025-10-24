import { Given, When, Then } from '@cucumber/cucumber';
import request from 'supertest';
import app from '../../src/app.js';
import assert from 'node:assert/strict';

let response = {};
let data = [];
let admin = [];

Given('existe en la base de datos el protocolo con id {string} y con los datos:', async function (string, dataTable) {
  const protocolo = dataTable.rowsHash();
  await request(app)
    .post('/protocolo')
    .send(protocolo)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
});

Given('existe el ciclo del protocolo {string} con:', function (string, dataTable) {
  const ciclo = dataTable.rowsHash();
  return request(app)
    .post(`/protocolo/${string}/ciclo`)
    .send(ciclo)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
});

Given('existe la droga con id {string} y con los datos:', function (string, dataTable) {
  const droga = dataTable.rowsHash();
  return request(app)
    .post('/droga')
    .send(droga)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
});

Given('existe la vía de administración con id {string} y con los datos:', function (string, dataTable) {
  const via = dataTable.rowsHash();
  return request(app)
    .post('/via-administracion')
    .send(via)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
});

Given('que tengo los siguientes datos de la administración de medicación:', function (dataTable) {
  data.push(dataTable.rowsHash());
});

When(/^publico la API "(.*)" con los datos de la administración$/, async function (endpoint) {
  return request(app)
    .post(endpoint)
    .send(data)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie)
    .then((res) => {
      response = res;
      admin = res.body.ciclos[0].administracion_medicacion;
    });
});

Then(/^el "(.*)" de la admin es "(.*)"$/, function (key, value) {
  assert.strictEqual(String(admin[0][key]), String(value));
});

Then('se crea correctamente la administración de medicación', function () {
  assert.ok(response);
  assert.strictEqual(response.status, 201);
  response = {};
  data = [];
});
