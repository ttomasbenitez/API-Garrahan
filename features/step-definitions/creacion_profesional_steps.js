import { Given, When, Then, Before } from '@cucumber/cucumber';
import request from 'supertest';
import app from '../../src/app.js';
import assert from 'node:assert/strict';

Before(function () {
  this.profesional = {};
  this.id_esperado = null;
  this.response = null;
});

Given(/^quiero crear un profesional con nombre "(.*)"$/, function (nombre) {
  this.profesional.nombre = nombre;
});

Given(/^quiero crear un profesional con apellido "(.*)"$/, function (apellido) {
  this.profesional.apellido = apellido;
});

Given(/^apellido del profesional "(.*)"$/, function (apellido) {
  this.profesional.apellido = apellido;
});

Given(/^dni del profesional "(.*)"$/, function (dni) {
  this.profesional.dni = dni;
});

Given(/^matricula del profesional "(.*)"$/, function (matricula) {
  this.profesional.matricula = matricula;
});

Given(/^especialidad del profesional "(.*)"$/, function (especialidad) {
  this.profesional.especialidad = especialidad;
});

When(/^publico en el endpoint de profesionales "(.*)" con los datos$/, async function (endpoint) {
  const response = await request(app)
    .post(endpoint)
    .send(this.profesional)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
  this.response = response;
});

Then('el profesional se crea correctamente', function () {
  const response = this.response;
  if (!response) throw new Error('No se recibió respuesta');
  if (response.status !== 201) throw new Error(`Status esperado 201, recibido ${response.status}`);
  if (!response.body.profesional_id) throw new Error('No se recibió id del profesional');
});

Then(/^obtengo el error "(.*)"$/, function (mensajeEsperado) {
  const response = this.response;
  if (!response) throw new Error('No se recibió respuesta');
  if (response.status !== 400) throw new Error(`Status esperado 400, recibido ${response.status}`);
  if (response.body.error !== mensajeEsperado) {
    throw new Error(`Error esperado "${mensajeEsperado}", recibido "${response.body.error}"`);
  }
});

Given(
  /^existe un profesional con nombre "(.*)", apellido "(.*)", dni "(.*)", matricula "(.*)", especialidad "(.*)"$/,
  async function (nombre, apellido, dni, matricula, especialidad) {
    const res = await request(app)
      .post('/profesional')
      .send({ nombre, apellido, dni, matricula, especialidad })
      .set('Accept', 'application/json')
      .set('Cookie', this.sessionCookie);
    if (res.status !== 201) throw new Error(`No se pudo crear el profesional: ${res.status}`);

    this.id_esperado = res.body.id;
  }
);

When(/^consulto en la API "(.*)" por su id de profesional$/, async function (endpoint) {
  this.response = await request(app)
    .get(endpoint)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
});

Then(/^el sistema me devuelve el profesional con id correspondiente$/, function () {
  if (!this.response) throw new Error('No hay respuesta');
  if (this.response.status !== 200) throw new Error(`Status esperado 200, recibido ${this.response.status}`);
  this.body = this.response.body;
});

Then(/^"(.*)" del profesional es "(.*)"$/, function (key, value) {
  assert(this.body[key].toString() === value, `Se esperaba ${value} pero se obtuvo ${this.body[key]}`);
});
