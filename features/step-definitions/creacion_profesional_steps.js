import { Given, When, Then, Before } from '@cucumber/cucumber';
import request from 'supertest';
import app from '../../src/app.js';

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
    .set('Accept', 'application/json');
  this.response = response;
});

Then('el profesional se crea correctamente', function () {
  const response = this.response;
  if (!response) throw new Error('No se recibió respuesta');
  if (response.status !== 201) throw new Error(`Status esperado 201, recibido ${response.status}`);
  if (!response.body.id) throw new Error('No se recibió id del profesional');
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
      .set('Accept', 'application/json');
    if (res.status !== 201) throw new Error(`No se pudo crear el profesional: ${res.status}`);

    this.id_esperado = res.body.id;
  }
);

When(/^consulto en la API de profesionales$/, async function () {
  this.response = await request(app).get(`/profesional/${this.id_esperado}`).set('Accept', 'application/json');
});

Then(/^el sistema me devuelve el profesional con id correspondiente$/, function () {
  if (!this.response) throw new Error('No hay respuesta');
  if (this.response.status !== 200) throw new Error(`Status esperado 200, recibido ${this.response.status}`);
  this.response = JSON.parse(this.response.body);
  if (this.response.id.toString() !== this.id_esperado.toString()) {
    throw new Error(`ID esperado ${this.id_esperado}, recibido ${this.response.id}`);
  }
});

Then(/^el nombre del profesional es "(.*)"$/, function (nombre) {
  if (this.response.nombre !== nombre) {
    throw new Error(`Nombre esperado ${nombre}, recibido ${this.response.nombre}`);
  }
});

Then(/^apellido del profesional es "(.*)"$/, function (apellido) {
  if (this.response.apellido !== apellido) {
    throw new Error(`Apellido esperado ${apellido}, recibido ${this.response.apellido}`);
  }
});

Then(/^dni del profesional es "(.*)"$/, function (dni) {
  if (this.response.dni.toString() !== dni) {
    throw new Error(`DNI esperado ${dni}, recibido ${this.response.dni}`);
  }
});

Then(/^matricula del profesional es "(.*)"$/, function (matricula) {
  if (this.response.matricula !== matricula) {
    throw new Error(`Matrícula esperada ${matricula}, recibida ${this.response.matricula}`);
  }
});

Then(/^especialidad del profesional es "(.*)"$/, function (especialidad) {
  if (this.response.especialidad !== especialidad) {
    throw new Error(`Especialidad esperada ${especialidad}, recibida ${this.response.especialidad}`);
  }
});

