import { Given, When, Then } from '@cucumber/cucumber';
import request from 'supertest';
import app from '../../src/app.js';
import assert from 'node:assert/strict';

let data = {};
let response;

Given(/^quiero crear el protocolo con el nombre de "(.*)"$/, function (nombreProtocolo) {
  data.nombre = nombreProtocolo;
});

Given(/^enfermedad "(.*)"$/, function (enfermedad) {
  data.enfermedad = enfermedad;
});

Given(/^de linea de tratamiento "(.*)"$/, function (lineaTratamiento) {
  data.linea = lineaTratamiento;
});

When(/^publico en la API "(.*)" con los datos$/, async function (endpoint) {
  response = await request(app)
    .post(endpoint)
    .send(data)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
});

Then('el protocolo se crea correctamente', function () {
  if (!response) throw new Error('No se recibió respuesta');
  if (response.status !== 201) throw new Error(`Status esperado 201, recibido ${response.status}`);
  assert.ok(response.body.protocolo_id);
  assert.strictEqual(response.body.nombre, data.nombre);
  assert.strictEqual(response.body.enfermedad, data.enfermedad);
  assert.strictEqual(response.body.linea, data.linea);
  data = {};
  response = null;
});

Then('el sistema responde correctamente', function () {
  if (!response) throw new Error('No se recibió respuesta');
  data = {};
  response = null;
});

Given(/^existe en la base de datos un protocolo con el nombre de "(.*)" con id "(.*)"$/, async function (nombreProtocolo, _idProtocolo) {
  data = { nombre: nombreProtocolo, enfermedad: 'Osteosarcoma', linea: 'primera linea' };
  await request(app)
    .post('/protocolos')
    .send(data)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
});

When(/^consulto en la API "(.*)"$/, async function (endpoint) {
  response = await request(app)
    .get(endpoint)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
});

Then(/^el sistema me devuelve una lista que contiene los siguientes protocolos:$/, function (dataTable) {
  if (!response) throw new Error('No se recibió respuesta');
  if (response.status !== 200) throw new Error(`Status esperado 200, recibido ${response.status}`);

  const actualProtocolos = response.body;
  if (!Array.isArray(actualProtocolos)) {
    throw new Error('La respuesta de la API no es un array, pero el test esperaba una lista.');
  }

  // Convertimos la tabla Gherkin en un array de objetos
  const expectedProtocolos = dataTable.hashes();

  for (const expected of expectedProtocolos) {
    const idBuscado = parseInt(expected.protocolo_id, 10);

    const actual = actualProtocolos.find(p => p.protocolo_id === idBuscado);

    assert.ok(actual, `No se encontró el protocolo con id ${idBuscado} en la respuesta.`);

    assert.strictEqual(
      actual.nombre,
      expected.nombre,
      `El nombre para el protocolo id ${idBuscado} no coincide. Esperado: "${expected.nombre}", Recibido: "${actual.nombre}"`
    );
  }
});

Then(/^el sistema me devuelve el protocolo con id "(.*)"$/, function (id) {
  if (response.status !== 200) throw new Error(`Status esperado 200, recibido ${response.status}`);
  response = response.body;
  assert.strictEqual(response.protocolo_id, parseInt(id, 10));
});

Then(/^el nombre del protocolo es "(.*)"$/, function (nombre) {
  assert.strictEqual(response.nombre, nombre);
});

Then(/^la enfermedad es "(.*)"$/, function (enfermedad) {
  assert.strictEqual(response.enfermedad, enfermedad);
});

Then(/^la linea de tratamiento es "(.*)"$/, function (linea) {
  assert.strictEqual(response.linea, linea);
});

Given(/^quiero agregar al protocolo con id "(.*)" un ciclo de tratamiento con los siguientes datos$/, function (idProtocolo, dataTable) {
  const ciclo = dataTable.rowsHash();
  if (!Array.isArray(data)) {
    data = [ciclo];
  } else {
    data.push(ciclo);
  }
});

const compareCicle = (idProtocolo, idCiclo) => {
  const index = response.ciclos.findIndex(c => c.ciclo_id === parseInt(idCiclo, 10));
  if (index === -1) throw new Error(`No se encontró el ciclo con id ${idCiclo} en el protocolo ${idProtocolo}`);
  const ciclo = response.ciclos[index];
  const esperado = data.find(d => d.ciclo_id === idCiclo);
  assert.ok(esperado, `No se encontraron datos esperados para el ciclo con id ${idCiclo}`);
  assert.strictEqual(ciclo.ciclo_id, parseInt(esperado.ciclo_id, 10));
  assert.strictEqual(ciclo.protocolo_id, parseInt(esperado.protocolo_id, 10));
  assert.strictEqual(ciclo.regimen, parseInt(esperado.regimen, 10));
  assert.strictEqual(ciclo.duracion_semanas, parseInt(esperado.duracion_semanas, 10));
  assert.strictEqual(ciclo.repeticiones, parseInt(esperado.repeticiones, 10));
};

Then(/^el ciclo de tratamiento se agrega correctamente al protocolo "(.*)" con id "(.*)"$/,  async function (idProtocolo, idCiclo) {
  response = await request(app)
    .get('/protocolos/' + idProtocolo)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);

  if (!response) throw new Error('No se recibió respuesta');
  if (response.status !== 200) throw new Error(`Status esperado 200, recibido ${response.status}`);
  response = response.body;
  assert.strictEqual(response.protocolo_id, parseInt(idProtocolo, 10));
  assert.ok(response.ciclos);
  compareCicle(idProtocolo, idCiclo);
});


Then(/^el ciclo de tratamiento se agrega correctamente al protocolo "(.*)" con los ids "(.*)","(.*)"$/,  async function (idProtocolo, idCiclo1, idCiclo2) {
  response = await request(app)
    .get('/protocolos/' + idProtocolo)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);

  if (!response) throw new Error('No se recibió respuesta');
  if (response.status !== 200) throw new Error(`Status esperado 200, recibido ${response.status}`);
  response = response.body;
  assert.strictEqual(response.protocolo_id, parseInt(idProtocolo, 10));
  assert.ok(response.ciclos);
  compareCicle(idProtocolo, idCiclo1);
  compareCicle(idProtocolo, idCiclo2);
});

Then(/^responde "(.*)" con el mensaje "(.*)"$/, function (statusCode, mensajeError) {
  assert.strictEqual(response.status, parseInt(statusCode, 10));
  assert.ok(response.body.message.includes(mensajeError));
});
