import { Given, When, Then } from '@cucumber/cucumber';
import request from 'supertest';
import app from '../../src/app.js';
import assert from 'node:assert/strict';

let response;
let createdDrogaId;
let createdFormaId;
let createdPresentacionId;
let createdViaId;
let createdViasIds = [];

Given(/^que existe una droga con los siguientes datos:$/, async function (dataTable) {
  const data = dataTable.rowsHash();
  const createResponse = await request(app)
    .post('/drogas')
    .send(data)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);

  const droga = Array.isArray(createResponse.body) ? createResponse.body[0] : createResponse.body;
  createdDrogaId = droga.droga_id;
});

Given(/^que existe una forma farmaceutica con los siguientes datos:$/, async function (dataTable) {
  const data = dataTable.rowsHash();
  const createResponse = await request(app)
    .post('/formas-farmaceuticas')
    .send(data)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);

  const forma = Array.isArray(createResponse.body) ? createResponse.body[0] : createResponse.body;
  createdFormaId = forma.forma_farmaceutica_id;
});

Given(/^que existe una presentacion de droga con los siguientes datos:$/, async function (dataTable) {
  const data = dataTable.rowsHash();
  const presentacion = {
    droga_id: createdDrogaId,
    forma_farmaceutica_id: createdFormaId,
    codigo_farmacia: data.codigo_farmacia,
    estado: data.estado,
    fuerza_valor: parseInt(data.fuerza_valor, 10),
    fuerza_unidad: data.fuerza_unidad
  };

  const createResponse = await request(app)
    .post(`/drogas/${presentacion.droga_id}/presentaciones`)
    .send([presentacion])
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);

  createdPresentacionId = createResponse.body[0].presentacion_id;
});

Given(/^que existe una via de administracion con los siguientes datos:$/, async function (dataTable) {
  const data = dataTable.rowsHash();
  const createResponse = await request(app)
    .post('/vias-administracion')
    .send(data)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);

  const via = Array.isArray(createResponse.body) ? createResponse.body[0] : createResponse.body;
  createdViaId = via.via_id;
});

Given(/^que existen las siguientes vias de administracion:$/, async function (dataTable) {
  const vias = dataTable.hashes();
  createdViasIds = [];

  for (const via of vias) {
    const createResponse = await request(app)
      .post('/vias-administracion')
      .send(via)
      .set('Accept', 'application/json')
      .set('Cookie', this.sessionCookie);

    const viaCreada = Array.isArray(createResponse.body) ? createResponse.body[0] : createResponse.body;
    createdViasIds.push(viaCreada.via_id);
  }
});

Given(/^que existe una presentacion droga via asociada$/, async function () {
  const data = {
    via_id: createdViaId,
    presentacion_id: createdPresentacionId,
    es_default: '0'
  };

  response = await request(app)
    .post('/presentaciones-droga-via')
    .send(data)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
});

Given(/^que existen las siguientes presentaciones droga via asociadas$/, async function () {
  const presentacionesVia = createdViasIds.map((via_id, index) => ({
    via_id,
    presentacion_id: createdPresentacionId,
    es_default: index === 0 ? '1' : '0'
  }));

  response = await request(app)
    .post('/presentaciones-droga-via')
    .send(presentacionesVia)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
});

When(/^publico en la API "(.*)" los datos de la presentacion droga via con es_default "(.*)"$/, async function (endpoint, es_default) {
  const data = {
    via_id: createdViaId,
    presentacion_id: createdPresentacionId,
    es_default
  };

  response = await request(app)
    .post(endpoint)
    .send(data)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
});

When(/^consulto en la API de presentacion droga via por sus IDs$/, async function () {
  response = await request(app)
    .get(`/presentaciones-droga-via/${createdViaId}/${createdPresentacionId}`)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
});

When(/^consulto en la API "(.*)" las vias de la presentacion$/, async function (endpoint) {
  const realEndpoint = endpoint.replace(':presentacion_id', createdPresentacionId);
  response = await request(app)
    .get(realEndpoint)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
});

When(/^elimino la presentacion droga via en la API$/, async function () {
  response = await request(app)
    .delete(`/presentaciones-droga-via/${createdViaId}/${createdPresentacionId}`)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
});

Then(/^se crea correctamente la presentacion droga via$/, function () {
  assert.ok(response);
  assert.strictEqual(response.status, 201);
  assert.strictEqual(response.body.creado, true);
  response = {};
});

Then(/^el sistema me devuelve la presentacion droga via correctamente$/, function () {
  assert.ok(response);
  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body.via_id, createdViaId);
  assert.strictEqual(response.body.presentacion_id, createdPresentacionId);
});

Then(/^el campo "(.*)" es "(.*)" en la presentacion droga via$/, function (campo, valor) {
  assert.strictEqual(String(response.body[campo]), String(valor));
});

Then(/^el sistema me devuelve una lista con (\d+) vias$/, function (cantidad) {
  assert.ok(Array.isArray(response.body));
  assert.strictEqual(response.body.length, parseInt(cantidad, 10));
});

Then(/^se obtiene correctamente las presentaciones droga via$/, function () {
  assert.ok(response);
  assert.strictEqual(response.status, 200);
  response = {};
  createdViasIds = [];
});

Then(/^el sistema elimina la presentacion droga via correctamente$/, function () {
  assert.ok(response);
  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body.eliminado, true);
  assert.strictEqual(response.body.via_id, createdViaId);
  assert.strictEqual(response.body.presentacion_id, createdPresentacionId);
  response = {};
});
