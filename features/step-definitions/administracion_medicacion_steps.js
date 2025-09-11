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

const compararAdmin = (admin1, admin2) => {
  assert.strictEqual(admin1.id_droga, Number(admin2.id_droga));
  assert.strictEqual(admin1.dosis, Number(admin2.dosis));
  assert.strictEqual(admin1.dosis_unidad, admin2.dosis_unidad);
  assert.strictEqual(admin1.frecuencia, admin2.frecuencia);
  assert.strictEqual(admin1.administracion_diaria, Number(admin2.administracion_diaria));
  assert.strictEqual(admin1.frecuencia_diaria, Number(admin2.frecuencia_diaria));
};

Then(/^la administración se crea correctamente$/, function () {
  assert.ok(response);
  assert.strictEqual(response.status, 201);
  const admin = response.body.ciclos[0].administracion_medicacion[0];
  assert.ok(admin.id);
  compararAdmin(admin, datosAdmin);
  response = null;
  datosAdmin = [];
});

Given(/^quiero agregar múltiples administraciones con los siguientes items$/, function (dataTable) {
  datosAdmin = dataTable.hashes();
});

Then(/^se crean "(.*)" administraciones para el protocolo "(.*)" ciclo "(.*)" régimen "(.*)"$/, function (cantidad, idProtocolo, idCiclo, regimen) {
  assert.ok(response);
  assert.strictEqual(response.status, 201);
  const admin1 = response.body.ciclos[1].administracion_medicacion[0];
  const admin2 = response.body.ciclos[1].administracion_medicacion[1];
  assert.ok(admin1.id);
  assert.ok(admin2.id);
  assert.strictEqual(response.body.protocolo_id, Number(idProtocolo));
  assert.strictEqual(response.body.ciclos[1].id, Number(idCiclo));
  assert.strictEqual(response.body.ciclos[1].regimen, Number(regimen));
  compararAdmin(admin1, datosAdmin[0]);
  compararAdmin(admin2, datosAdmin[1]);
  response = null;
  datosAdmin = [];
});

