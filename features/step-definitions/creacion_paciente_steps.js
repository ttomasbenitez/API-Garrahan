import { Given, When, Then, Before } from '@cucumber/cucumber';
import request from 'supertest';
import app from '../../src/app.js';

Before(function () {
  this.paciente = {};
  this.response = null;
});

Given(/^quiero crear un paciente con nombre "(.*)"$/, function (nombre) {
  this.paciente.nombre = nombre;
});

Given(/^apellido "(.*)"$/, function (apellido) {
  this.paciente.apellido = apellido;
});

Given(/^id_hospitalario "(.*)"$/, function (idHospitalario) {
  this.paciente.id_hospitalario = idHospitalario;
});

Given(/^fecha_nacimiento "(.*)"$/, function (fecha) {
  this.paciente.fecha_nacimiento = fecha;
});

Given(/^peso "(.*)"$/, function (peso) {
  this.paciente.peso = parseInt(peso);
});

Given(/^sexo "(.*)"$/, function (sexo) {
  this.paciente.sexo = sexo;
});

Given(/^profesional_id$/, async function () {
  const response = await request(app)
    .post('/profesional')
    .send({nombre: 'Walter', apellido: 'Perez', dni: '12345678', matricula: 'MAT12345', especialidad: 'Pediatria'})
    .set('Accept', 'application/json');
  if (response.status !== 201) {
    throw new Error(`No se pudo crear el profesional necesario para el paciente. Status recibido: ${response.status}`);
  }
  this.paciente.profesional_id = response.body.id;
});

Given(
  /^existe un paciente con nombre "(.*)", apellido "(.*)", id_hospitalario "(.*)", fecha_nacimiento "(.*)", peso "(.*)", sexo "(.*)", profesional_id "(.*)"$/,
  async function (nombre, apellido, id_hospitalario, fecha_nacimiento, peso, sexo, profesional_id) {
    const profesional_res = await request(app)
      .post('/profesional')
      .send({ nombre: 'Walter', apellido: 'García', dni: 20912121, id: profesional_id })
      .set('Accept', 'application/json');
    if (profesional_res.status !== 201) throw new Error(`No se pudo crear el profesional: ${profesional_res.status}`);

    const res = await request(app)
      .post('/paciente')
      .send({ nombre: nombre, apellido: apellido, id_hospitalario: id_hospitalario, fecha_nacimiento: fecha_nacimiento
        , peso: peso, sexo: sexo, profesional_id: profesional_id
      })
      .set('Accept', 'application/json');
    if (res.status !== 201) throw new Error(`No se pudo crear el paciente: ${res.status}`);

    this.paciente.id = res.body.id;
  }
);

When(/^consulto en la API de pacientes por él$/, async function () {
  const response = await request(app)
    .get(`/paciente/${this.paciente.id}`)
    .set('Accept', 'application/json');
  this.response = response;
});


When(/^publico en el endpoint "(.*)" con los datos$/, async function (endpoint) {
  const response = await request(app)
    .post(endpoint)
    .send(this.paciente)
    .set('Accept', 'application/json');
  this.response = response;
});

Then('el paciente se crea correctamente', function () {
  if (!this.response) throw new Error('No se recibió respuesta');
  if (this.response.status !== 201) throw new Error(`Status esperado 201, recibido ${this.response.status}`);
  if (!this.response.body) throw new Error('No se recibió id del paciente');
});

Then(/^el sistema me devuelve el paciente correspondiente$/, function () {
  if (!this.response) throw new Error('No hay respuesta');
  if (this.response.status !== 200) throw new Error(`Status esperado 200, recibido ${this.response.status}`);
  this.response = JSON.parse(this.response.body);
  if (this.response.id.toString() !== this.paciente.id.toString()) {
    throw new Error(`ID esperado ${this.paciente.id}, recibido ${this.response.id}`);
  }
});

Then(/^el nombre del paciente esperado es "(.*)"$/, function (nombreEsperado) {
  if (this.response.nombre !== nombreEsperado) {
    throw new Error(`Nombre esperado ${nombreEsperado}, recibido ${this.response.nombre}`);
  }
});

Then(/^apellido esperado "(.*)"$/, function (apellidoEsperado) {
  if (this.response.apellido !== apellidoEsperado) {
    throw new Error(`Apellido esperado ${apellidoEsperado}, recibido ${this.response.apellido}`);
  }
});

Then(/^id_hospitalario esperado "(.*)"$/, function (id_hospitalarioEsperado) {
  if (this.response.id_hospitalario !== id_hospitalarioEsperado) {
    throw new Error(`id_hospitalario esperado ${id_hospitalarioEsperado}, recibido ${this.response.idHospitalario}`);
  }
});

Then(/^fecha_nacimiento esperada "(.*)"$/, function (fecha_nacimientoEsperada) {
  if (this.response.fecha_nacimiento !== fecha_nacimientoEsperada) {
    throw new Error(`fecha_nacimiento esperada ${fecha_nacimientoEsperada}, recibido ${this.response.fecha_nacimiento}`);
  }
});

Then(/^peso esperado "(.*)"$/, function (pesoEsperado) {
  if (this.response.peso !== parseInt(pesoEsperado)) {
    throw new Error(`Peso esperado ${pesoEsperado}, recibido ${this.response.peso}`);
  }
});

Then(/^sexo esperado "(.*)"$/, function (sexoEsperado) {
  if (this.response.sexo !== sexoEsperado) {
    throw new Error(`Sexo esperado ${sexoEsperado}, recibido ${this.response.sexo}`);
  }
});

Then(/^profesional_id esperado "(.*)"$/, function (profesional_idEsperado) {
  if (this.response.profesional_id !== parseInt(profesional_idEsperado)) {
    throw new Error(`profesional_id esperado ${profesional_idEsperado}, recibido ${this.response.profesional_id}`);
  }
});

