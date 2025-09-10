import { Given, When, Then } from '@cucumber/cucumber';
import request from 'supertest';
import app from '../../src/app.js';
import assert from 'node:assert/strict';

let datosAdmin;
let response;

Given(/^existe en la base de datos un ciclo para el protocolo "(.*)" con ciclo_id "(.*)" y regimen "(.*)"$/, async function (idProtocolo, cicloId, regimen) {
  const dataTable = {
    protocolo_id: idProtocolo,
    ciclo_id: cicloId,
    regimen: regimen,
    duracion_semanas: 5,
    ciclo_final: false,
    repeticiones: 1,
  };
  await request(app)
    .post('/protocolo/' + idProtocolo + '/ciclo')
    .send(dataTable)
    .set('Accept', 'application/json');
});

Given(/^existe en la base de datos una droga con id "(.*)" y con los datos:$/,async function (idDroga, dataTable) {
  await request(app)
    .post('/droga')
    .send([dataTable.rowsHash()])
    .set('Accept', 'application/json');
});

Given(/^quiero agregar administración de medicación con los siguientes datos$/, function (dataTable) {
  datosAdmin = dataTable.rowsHash();
});

When(/^publico en la API "(.*)" con los datos de la administración$/, async function (endpoint) {
  response = await request(app)
    .post(endpoint)
    .send(datosAdmin)
    .set('Accept', 'application/json');
});

Then(/^la administración se crea correctamente$/, function () {
  assert.ok(response);
  assert.strictEqual(response.status, 201);
  const admin = response.body.ciclos[0].administracion_medicacion[0];
  assert.ok(admin.id);
  assert.strictEqual(admin.id_droga, Number(datosAdmin.id_droga));
  assert.strictEqual(admin.dosis, Number(datosAdmin.dosis));
  assert.strictEqual(admin.dosis_unidad, datosAdmin.dosis_unidad);
  assert.strictEqual(admin.frecuencia, datosAdmin.frecuencia);
  assert.strictEqual(admin.administracion_diaria, Number(datosAdmin.administracion_diaria));
  assert.strictEqual(admin.frecuencia_diaria, Number(datosAdmin.frecuencia_diaria));
});

