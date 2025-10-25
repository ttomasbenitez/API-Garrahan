import { Given, When, Then } from '@cucumber/cucumber';
import request from 'supertest';
import app from '../../src/app.js';
import assert from 'node:assert/strict';

let response;
let data;

Given('existe en la base de datos el paciente con id {string} y con los datos:', async function (string, dataTable) {
  const paciente = dataTable.rowsHash();
  await request(app)
    .post('/paciente')
    .send(paciente)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
});

Given('existe en la base de datos el profesional con id {string} y con los datos:', async function (string, dataTable) {
  const profesional = dataTable.rowsHash();
  await request(app)
    .post('/profesional')
    .send(profesional)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
});

Given('que tengo los siguientes datos de la receta:', function (dataTable) {
  data = dataTable.rowsHash();
});

When('publico la API {string} con los datos de la receta', async function (endpoint) {
  await request(app)
    .post(endpoint)
    .send(data)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie)
    .then(function (res) {
      response = res;
    });
});

Then('la {string} de la receta es {string}', function (string, string2) {
  assert.equal(response.body[string], string2);
});

Then('se crea correctamente la receta', function () {
  assert.equal(response.status, 201);
  assert.ok(response.body);
  data = null;
  response = null;
});

Then('el {string} de la receta es {string}', function (key, value) {
  assert(response.body[key].toString() === value, `Se esperaba ${value} pero se obtuvo ${response.body[key]}`);
});

Then('el sistema rechaza la creación por clave foránea inválida {string}', function (code) {
  assert.equal(response.body.code, code);
});

Then('no se crea la receta', function () {
  assert.equal(response.status, 404);
  data = null;
  response = null;
});


Then('el sistema rechaza la creación por campos obligatorios faltantes', function () {
  assert.equal(response.status, 404);
  assert.equal(response.body.error, 'protocolo_id, ciclo_id y regimen son obligatorios.');
  assert.equal(response.body.code, 'RECETA_PACIENTE_CREACION_ERROR');

});
