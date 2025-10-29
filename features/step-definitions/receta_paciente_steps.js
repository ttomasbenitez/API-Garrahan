import { Given, When, Then } from '@cucumber/cucumber';
import request from 'supertest';
import app from '../../src/app.js';
import assert from 'node:assert/strict';

let response;
let data;

Given('existe en la base de datos el paciente con id {string} y con los datos:', async function (string, dataTable) {
  const paciente = dataTable.rowsHash();
  await request(app)
    .post('/pacientes')
    .send(paciente)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
});

Given('existe en la base de datos el profesional con id {string} y con los datos:', async function (string, dataTable) {
  const profesional = dataTable.rowsHash();
  await request(app)
    .post('/profesionales')
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
  assert.equal(response.body.error, 'peso, talla y superficie_corporal son requeridos');
  assert.equal(response.body.code, 'RECETA_PACIENTE_CREACION_ERROR');
});

Given('existe en la base de datos una receta con id {string} y con los datos:', async function (string, dataTable) {
  data = dataTable.rowsHash();
  await request(app)
    .post('/recetas')
    .send(data)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie)
    .then(function (res) {
      assert.ok(res.body);
    });
});

Given(/^existen en la base de datos las siguientes recetas:$/, async function (dataTable) {
  // Convertimos la tabla Gherkin en un array de objetos
  const recetas = dataTable.hashes();

  for (const receta of recetas) {
    const body = {
      nombre: 'Juan',
      apellido: 'Pérez',
      tipo_documento: 'DNI',
      numero_documento: '40123456',
      fecha_nacimiento: '2020-05-21',
      sexo: 'M',
      nacionalidad: 'Argentina',
      domicilio_calle: 'Av. Corrientes',
      domicilio_numero: '1234',
      domicilio_piso: '5',
      domicilio_depto: 'B',
      codigo_postal: 'C1043',
      localidad: 'CABA',
      partido: 'San Nicolás',
      telefono: '1122334455',
      email: 'juan.perez@example.com',
      peso: 40.4,
      talla: 140.7,
      superficie_corporal: 1.2,
      diagnostico: 'Leucemia Linfoblástica Aguda',
      numero_ciclo: receta.ciclo_id,
      protocolo_id: receta.protocolo_id,
      ciclo_id: receta.ciclo_id,
      regimen: receta.regimen,
      paciente_id: receta.paciente_id,
      profesional_id: 1,
      estado: 'Activo',
      fecha_receta: receta.fecha_receta,
      receta_id: receta.receta_id,
    };

    const res = await request(app)
      .post('/recetas')
      .send(body)
      .set('Accept', 'application/json')
      .set('Cookie', this.sessionCookie);

    assert.strictEqual(res.status, 201, `Error creando receta ${receta.receta_id}`);
    assert.ok(res.body, 'Respuesta vacía del backend al crear receta');
  }
});

When('consulto en la API {string} por su id de receta', async function (endpoint) {
  await request(app)
    .get(endpoint)
    .send(data)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie)
    .then(function (res) {
      response = res;
    });
});

Then('el sistema me devuelve la receta con id {string}', function (id) {
  assert.equal(Number(id), response.body.id);
  assert.equal(Number(data.protocolo_id), response.body.contexto.protocolo_id);
  assert.equal(Number(data.ciclo_id), response.body.contexto.ciclo_id);
  assert.equal(Number(data.regimen), response.body.contexto.regimen);
  assert.equal(Number(data.paciente_id), response.body.paciente_id);
  assert.equal(Number(data.profesional_id), response.body.profesional_id);
  assert.equal(data.estado, response.body.estado);
  assert.equal(Number(data.peso), response.body.datos_paciente.peso);
  assert.equal(Number(data.talla), response.body.datos_paciente.talla);
  assert.equal(Number(data.superficie_corporal), response.body.datos_paciente.superficie_corporal);
});

Then('responde correctamente la receta', function () {
  assert.equal(response.status, 200);
  data = null;
  response = null;
});

Then('el {string} del paciente en la receta es {string}', function (key, value) {
  const paciente_snapshot = response.body.paciente_snapshot;
  assert.equal(paciente_snapshot.identidad[key], value);
});

Given('existe una receta del paciente con id {string} y con los datos:', async function (string, dataTable) {
  data = dataTable.rowsHash();
});


Given('la receta con id {string} tiene los detalles:', function (string, dataTable) {
  const detalles = dataTable.rowsHash();
  data.detalles = data.detalles ? [...data.detalles, detalles] : [detalles];
});

Given('la receta con id {string} está guardada en el sistema', async function (id) {
  await request(app)
    .post('/recetas')
    .send(data)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie)
    .then(function (res) {
      response = res;
    });
});


Given('que tengo los siguientes datos del detalle de receta:', function (dataTable) {
  data.detalles = [dataTable.rowsHash()];
});

When('publico en la API {string} con los datos del detalle', async function (endpoint) {
  await request(app)
    .post(endpoint)
    .send(data)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie)
    .then(function (res) {
      response = res;
    });
});

Then('se crea correctamente el detalle de receta', function () {
  assert.equal(response.status, 201);
  data = null;
  response = null;
});

Then('el sistema me devuelve una lista con {int} recetas', function (cantidadRecetas) {
  assert.equal(Array.isArray(response.body), true, 'La respuesta no es un array');
  assert.equal(response.body.length, cantidadRecetas, `Se esperaban ${cantidadRecetas} recetas pero se obtuvieron ${response.body.length}`);
});

Then('el primer registro tiene receta_id = {int}', function (recetaId) {
  assert.equal(response.body[0].receta_id, recetaId);
});

Then('el segundo registro tiene receta_id = {int}', function (recetaId) {
  assert.equal(response.body[1].receta_id, recetaId);
});
