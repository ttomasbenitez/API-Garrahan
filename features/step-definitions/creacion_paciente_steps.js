import { Given, When, Then, Before } from '@cucumber/cucumber';
import request from 'supertest';
import app from '../../src/app.js';
import assert from 'node:assert/strict';

Before(function () {
  this.paciente = {};
  this.response = null;
});

Given(/^quiero crear un paciente con los siguientes datos:$/, function (dataTable) {
  this.paciente = dataTable.rowsHash();
});

Given(/^existe un paciente con los siguientes datos:$/, function (dataTable) {
  this.paciente = dataTable.rowsHash();
});

Given(/^profesional_id$/, async function () {
  const response = await request(app)
    .post('/profesional')
    .send({nombre: 'Walter', apellido: 'Perez', dni: '12345678', matricula: 'MAT12345', especialidad: 'Pediatria'})
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
  if (response.status !== 201) {
    throw new Error(`No se pudo crear el profesional necesario para el paciente. Status recibido: ${response.status}`);
  }
  this.paciente.profesional_id = response.body.profesional_id;
});

Given(
  /^existe un paciente con nombre "(.*)", apellido "(.*)", id_hospitalario "(.*)", fecha_nacimiento "(.*)", peso "(.*)", sexo "(.*)", profesional_id "(.*)"$/,
  async function (nombre, apellido, id_hospitalario, fecha_nacimiento, peso, sexo, profesional_id) {
    const profesional_res = await request(app)
      .post('/profesional')
      .send({ nombre: 'Walter', apellido: 'García', dni: 20912121, id: profesional_id })
      .set('Accept', 'application/json')
      .set('Cookie', this.sessionCookie);
    if (profesional_res.status !== 201) throw new Error(`No se pudo crear el profesional: ${profesional_res.status}`);

    const res = await request(app)
      .post('/paciente')
      .send({ nombre: nombre, apellido: apellido, id_hospitalario: id_hospitalario, fecha_nacimiento: fecha_nacimiento
        , peso: peso, sexo: sexo, profesional_id: profesional_id
      })
      .set('Accept', 'application/json')
      .set('Cookie', this.sessionCookie);
    if (res.status !== 201) throw new Error(`No se pudo crear el paciente: ${res.status}`);

    this.paciente.paciente_id = res.body.paciente_id;
  }
);

When(/^consulto en la API "(.*)" por su id de paciente$/, async function (endpoint) {
  await request(app)
    .post('/paciente')
    .send(this.paciente)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);

  const response = await request(app)
    .get(endpoint)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
  this.response = response;
});


When(/^publico en el endpoint "(.*)" con los datos del paciente$/, async function (endpoint) {
  const response = await request(app)
    .post(endpoint)
    .send(this.paciente)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
  this.response = response;
});

Then('el paciente se crea correctamente', function () {
  if (!this.response) throw new Error('No se recibió respuesta');
  assert.ok(this.response);
  assert.strictEqual(this.response.status, 201);
  if (!this.response.body) throw new Error('No se recibió id del paciente');
});

Then(/^el sistema me devuelve el paciente correspondiente$/, function () {
  if (!this.response) throw new Error('No hay respuesta');
  assert.ok(this.response);
  assert.strictEqual(this.response.status, 200);
  this.body = this.response.body;
});

Then(/^"(.*)" del paciente esperado es "(.*)"$/, function (key, value) {
  assert(this.body[key].toString() === value, `Se esperaba ${value} pero se obtuvo ${this.body[key]}`);
});

Then(/^"(.*)" del paciente esperada es "(.*)"$/, function (key, value) {
  assert(this.body[key].toString() === value, `Se esperaba ${value} pero se obtuvo ${this.body[key]}`);
});

