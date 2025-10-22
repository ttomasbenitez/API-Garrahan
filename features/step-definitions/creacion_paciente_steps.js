import { Given, When, Then, Before } from '@cucumber/cucumber';
import request from 'supertest';
import oracleDBInstance from '../../src/db/connection_pool.js';
import app from '../../src/app.js';
import assert from 'node:assert/strict';

Before(function () {
  this.paciente = {};
  this.response = null;
  this.profesionalLogueadoId = null;
});

Given(/^estoy logueado como médico con id "(.*)"$/, async function (idProfesional) {
  this.profesionalLogueadoId = Number(idProfesional);
  await oracleDBInstance.execute(
    `INSERT INTO profesional (profesional_id, nombre, apellido, dni, matricula, especialidad) 
     VALUES (:id, 'Walter', 'Pérez', '20122123', 'MP12345', 'Oncología')`,
    { id: Number(idProfesional) },
    { autoCommit: true }
  );

  const res = await request(app)
    .post('/auth/login-test')
    .send({ id: idProfesional, name: 'Dr. Juan', role: 'medico' })
    .set('Accept', 'application/json');

  this.sessionCookie = res.headers['set-cookie'];
});

Given(/^quiero crear un paciente con los siguientes datos:$/, function (dataTable) {
  this.paciente = dataTable.rowsHash();
});

Given(/^existe un paciente con los siguientes datos asociado al médico con id "(.*)":$/, async function (_idProfesional, dataTable) {
  this.paciente = dataTable.rowsHash();
  await request(app)
    .post('/paciente')
    .send(this.paciente)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);

});

Given(/^existe un paciente con los siguientes datos no asociado al médico con id "(.*)":$/, async function (_idProfesional, dataTable) {
  this.paciente = dataTable.rowsHash();

  await oracleDBInstance.execute(
    `INSERT INTO paciente (nombre, apellido, id_hospitalario, fecha_nacimiento, peso, sexo, obra_social)
    VALUES (:nombre, :apellido, :id_hospitalario, TO_DATE(:fecha_nacimiento, 'YYYY-MM-DD'), :peso, :sexo, :obra_social)`,
    {
      nombre: this.paciente.nombre,
      apellido: this.paciente.apellido,
      id_hospitalario: this.paciente.id_hospitalario,
      fecha_nacimiento: this.paciente.fecha_nacimiento,
      peso: this.paciente.peso,
      sexo: this.paciente.sexo,
      obra_social: this.paciente.obra_social
    },
    { autoCommit: true }
  );
});

Given('quiero obtener el paciente con id_hospitalario {string} del sistema del hospital', function (idHospitalario) {
  this.paciente.id_hospitalario = idHospitalario;
});

Given('con nombre {string} y apellido {string}', function (nombre, apellido) {
  this.paciente.nombre = nombre;
  this.paciente.apellido = apellido;
});

When(/^consulto en la API externa "(.*)" por su id_hospitalario$/, async function (endpoint) {
  const response = await request(app)
    .get(endpoint)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
  this.response = response;
});

When(/^consulto en la API "(.*)" por su id de paciente$/, async function (endpoint) {
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
  this.paciente = this.response.body;
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

Then(/^el sistema devuelve el estado "(.*)"$/, function (responseStatus) {
  assert.strictEqual(this.response.status, Number(responseStatus));
});

Then('el sistema devuelve el paciente esperado', function () {
  assert.strictEqual(this.response.status, 200);
  assert.strictEqual(this.response.body.id_hospitalario, this.paciente.id_hospitalario);
  assert.strictEqual(this.response.body.nombre, this.paciente.nombre);
  assert.strictEqual(this.response.body.apellido, this.paciente.apellido);
});

Then(/^el mensaje de error "(.*)"$/, function (mensajeError) {
  assert.ok(this.response.body.error === mensajeError);
});
