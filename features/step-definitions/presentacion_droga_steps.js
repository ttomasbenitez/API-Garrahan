import { Given, When, Then } from '@cucumber/cucumber';
import request from 'supertest';
import app from '../../src/app.js';
import assert from 'node:assert/strict';

let presentaciones = [];
let drogas = [];
let formas = [];
let response;

// Steps para crear drogas (prerequisito)
Given(/^que existen las siguientes drogas:$/, async function (dataTable) {
  const rows = dataTable.hashes();
  drogas = rows.map(row => ({
    nombre_generico: row.nombre,
    codigo_farmacia: row.codigo_farmacia,
    estado: row.estado,
    codigo_atc: row.codigo_atc
  }));
  response = await request(app)
    .post('/drogas')
    .send(drogas)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
  if (response.status !== 201) {
    throw new Error(`Error al crear drogas: ${JSON.stringify(response.body)}`);
  }
});

// Steps para crear formas farmaceuticas (prerequisito)
Given(/^que existen las siguientes formas farmaceuticas:$/, async function (dataTable) {
  const rows = dataTable.hashes();
  formas = rows;
  response = await request(app)
    .post('/formas-farmaceuticas')
    .send(formas)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
  if (response.status !== 201) {
    throw new Error(`Error al crear formas farmaceuticas: ${JSON.stringify(response.body)}`);
  }
});

Given(/^que tengo los siguientes datos de la presentacion de droga:$/, function (dataTable) {
  const data = dataTable.rowsHash();
  const presentacion = {
    droga_id: parseInt(data.droga_id, 10),
    forma_farmaceutica_id: parseInt(data.forma_farmaceutica_id, 10),
    codigo_farmacia: data.codigo_farmacia,
    estado: data.estado,
    fuerza_valor: parseInt(data.fuerza_valor, 10),
    fuerza_unidad: data.fuerza_unidad
  };
  presentaciones.push(presentacion);
});

When(/^publico en la API de presentacion droga "(.*)" con los datos de la presentacion$/, async function (endpoint) {
  response = await request(app)
    .post(endpoint)
    .send(presentaciones)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
});

Then(/^el campo "(.*)" de la presentacion es "(.*)"$/, function (campo, valor) {
  const body = Array.isArray(response.body) ? response.body[0] : response.body;
  assert.strictEqual(String(body[campo]), String(valor));
});

Then(/^se crea correctamente la presentacion$/, function () {
  presentaciones = [];
  assert.ok(response);
  assert.strictEqual(response.status, 201);
  response = {};
});

Given(/^existe en la base de datos una presentacion de droga con id "(.*)" y con los datos:$/, async function (_id, dataTable) {
  const data = dataTable.rowsHash();
  // Convertir campos numéricos
  const presentacion = {
    droga_id: parseInt(data.droga_id, 10),
    forma_farmaceutica_id: parseInt(data.forma_farmaceutica_id, 10),
    codigo_farmacia: data.codigo_farmacia,
    estado: data.estado,
    fuerza_valor: parseInt(data.fuerza_valor, 10),
    fuerza_unidad: data.fuerza_unidad
  };
  presentaciones.push(presentacion);
  const createResponse = await request(app)
    .post('/presentaciones-droga')
    .send([presentacion])
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
  // Guardar el ID real creado
  this.createdPresentacionId = createResponse.body[0].presentacion_id;
});

When(/^consulto en la API de presentacion droga "(.*)" por su id$/, async function (endpoint) {
  response = await request(app)
    .get(endpoint)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
});

Then(/^el sistema me devuelve la presentacion de droga con id "(.*)"$/, function (id) {
  assert.ok(response);
  assert.strictEqual(response.status, 200);
  assert.ok(response.body.presentacion_id);
  assert.strictEqual(response.body.presentacion_id, parseInt(id, 10));
});

Then(/^el campo "(.*)" es "(.*)" en la presentacion$/, function (campo, valor) {
  assert.strictEqual(String(response.body[campo]), String(valor));
});

When(/^consulto en la API de presentacion droga "(.*)"$/, async function (endpoint) {
  response = await request(app)
    .get(endpoint)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
});

Then(/^el sistema me devuelve una lista con (\d+) presentaciones de droga en la consulta$/, function (cantidad) {
  assert.ok(Array.isArray(response.body));
  assert.strictEqual(response.body.length, parseInt(cantidad, 10));
});

Then(/^el primer registro de presentacion tiene "(.*)" = "(.*)" y "(.*)" = "(.*)"$/, function (campo1, valor1, campo2, valor2) {
  assert.strictEqual(String(response.body[0][campo1]), String(valor1));
  assert.strictEqual(String(response.body[0][campo2]), String(valor2));
});

Then(/^el segundo registro de presentacion tiene "(.*)" = "(.*)" y "(.*)" = "(.*)"$/, function (campo1, valor1, campo2, valor2) {
  assert.strictEqual(String(response.body[1][campo1]), String(valor1));
  assert.strictEqual(String(response.body[1][campo2]), String(valor2));
});

Then(/^se obtiene correctamente la presentacion$/, function () {
  assert.ok(response);
  assert.strictEqual(response.status, 200);
  response = {};
  presentaciones = [];
});

When(/^elimino la presentacion en la API "(.*)"$/, async function (endpoint) {
  const realEndpoint = endpoint.replace(/\/\d+$/, `/${this.createdPresentacionId}`);
  response = await request(app)
    .delete(realEndpoint)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
});

Then(/^el sistema elimina la presentacion de droga con id "(.*)"$/, function (_id) {
  assert.ok(response);
  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body.eliminado, true);
  assert.strictEqual(response.body.id, this.createdPresentacionId);
});

Then(/^se elimina correctamente la presentacion$/, function () {
  assert.ok(response);
  assert.strictEqual(response.status, 200);
  response = {};
});
