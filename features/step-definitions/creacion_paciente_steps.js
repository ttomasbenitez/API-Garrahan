import { Given, When, Then } from '@cucumber/cucumber';
import request from 'supertest';
import app from '../../src/app.js';

const paciente = {};

Given(/^quiero crear un paciente con nombre "(.*)"$/, function (nombre) {
  paciente.nombre = nombre;
});

Given(/^apellido "(.*)"$/, function (apellido) {
  paciente.apellido = apellido;
});

Given(/^id_hospitalario "(.*)"$/, function (idHospitalario) {
  paciente.id_hospitalario = idHospitalario;
});

Given(/^fecha_nacimiento "(.*)"$/, function (fecha) {
  paciente.fecha_nacimiento = fecha;
});

Given(/^peso "(.*)"$/, function (peso) {
  paciente.peso = parseFloat(peso);
});

Given(/^sexo "(.*)"$/, function (sexo) {
  paciente.sexo = sexo;
});

Given(/^profesional_id "(.*)"$/, function (profesionalId) {
  paciente.profesional_id = parseInt(profesionalId);
});

When(/^publico en el endpoint "(.*)" con los datos$/, async function (endpoint) {
  const response = await request(app)
    .post(endpoint)
    .send(paciente)
    .set('Accept', 'application/json');
  this.response = response;
});

Then('el paciente se crea correctamente', function () {
  const response = this.response;
  if (!response) throw new Error('No se recibió respuesta');
  if (response.status !== 201) throw new Error(`Status esperado 201, recibido ${response.status}`);
  if (!response.body.id) throw new Error('No se recibió id del paciente');
});
