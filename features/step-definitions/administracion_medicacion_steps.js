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
    .post('/protocolos')
    .send(protocolo)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
});

Given('existe el ciclo del protocolo {string} con:', async function (string, dataTable) {
  const ciclo = dataTable.rowsHash();
  await request(app)
    .post(`/protocolos/${string}/ciclos`)
    .send(ciclo)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
});

Given('existe la droga con id {string} y con los datos:', function (string, dataTable) {
  const droga = dataTable.rowsHash();
  return request(app)
    .post('/drogas')
    .send(droga)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
});

Given('existe la vía de administración con id {string} y con los datos:', function (string, dataTable) {
  const via = dataTable.rowsHash();
  return request(app)
    .post('/vias-administracion')
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

const compararAdmin = (admin1, admin2) => {
  assert.strictEqual(String(admin1.droga_id), String(admin2.droga_id));
  assert.strictEqual(String(admin1.via_id), String(admin2.via_id));
  assert.strictEqual(String(admin1.fuerza_valor), String(admin2.fuerza_valor));
  assert.strictEqual(String(admin1.fuerza_unidad), String(admin2.fuerza_unidad));
  assert.strictEqual(String(admin1.cantidad_dias), String(admin2.cantidad_dias));
  assert.strictEqual(String(admin1.frecuencia_diaria), String(admin2.frecuencia_diaria));
};

Then('obtengo los datos de las administraciones con el id {string} y {string}', function (id1, id2) {
  assert.ok(Array.isArray(admin));
  assert.strictEqual(admin.length, 2);
  assert.strictEqual(String(admin[0].id), String(id1));
  assert.strictEqual(String(admin[1].id), String(id2));
  compararAdmin(admin[0], data[0]);
  compararAdmin(admin[1], data[1]);
});

Given('existen en la base de datos las siguientes administraciones de medicación:', async function (dataTable) {
  const admins = dataTable.hashes();

  const promises = admins.map(async (admin) => {
    try {

      return await request(app)
        .post(`/protocolos/${admin.protocolo_id}/ciclos/${admin.ciclo_id}/regimenes/${admin.regimen}/administraciones`)
        .send([admin])
        .set('Accept', 'application/json')
        .set('Cookie', this.sessionCookie);
    } catch (error) {
      console.error(`Error al insertar la administración: ${JSON.stringify(admin)}`, error);
      throw error; // Relanza el error para que la prueba falle
    }
  });

  await Promise.all(promises);
});
