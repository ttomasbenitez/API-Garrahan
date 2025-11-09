import { Given, When, Then } from '@cucumber/cucumber';
import request from 'supertest';
import app from '../../src/app.js';
import assert from 'node:assert/strict';
import oracleDBInstance from '../../src/db/connection_pool.js';

let datosProtocoloPaciente;
let response;
let paciente_id;

Given(/^existe en la base de datos un paciente con id "(.*)" llamado "(.*)"$/, async function (idPaciente, nombreCompleto) {

  const [nombre, apellido] = nombreCompleto.split(' ');
  const pacResponse = await request(app)
    .post('/pacientes')
    .send({
      nombre,
      apellido,
      dni: '12345678',
      id_hospitalario: 'P12345',
      fecha_nacimiento: '2020-05-21',
      peso: 30,
      sexo: 'M',
      obra_social: 'OSDE',
    })
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);

  paciente_id = pacResponse.body.paciente_id;
});

Given(/^existe en la base de datos un protocolo con id "(.*)" y cantidadRegimenes "(.*)" llamado "(.*)"$/,
  async function (idProtocolo, cantidadRegimenes, nombreProtocolo) {
    await oracleDBInstance.execute(
      `INSERT INTO protocolo (protocolo_id, nombre, enfermedad, linea, cantidad_regimenes) 
     VALUES (:id, :nombre, 'Test', '1ra', :cantidadRegimenes)`,
      { id: Number(idProtocolo), nombre: nombreProtocolo, cantidadRegimenes: Number(cantidadRegimenes) },
      { autoCommit: true }
    );
  });

Given(/^existe en la base de datos un ciclo con protocolo_id "(.*)", ciclo_id "(.*)" y regimen "(.*)"$/, async function (idProtocolo, idCiclo, regimen) {
  await oracleDBInstance.execute(
    `INSERT INTO CICLO (PROTOCOLO_ID, CICLO_ID, REGIMEN, DURACION_SEMANAS, CICLO_FINAL, REPETICIONES)
     VALUES (:protocolo_id, :ciclo_id, :regimen, 2, '0', 2)`,
    {
      protocolo_id: Number(idProtocolo),
      ciclo_id: Number(idCiclo),
      regimen: Number(regimen)
    },
    { autoCommit: true }
  );
});

Given(/^quiero asignar a un paciente un protocolo con los siguientes datos$/, function (dataTable) {
  const row = dataTable.rowsHash();
  datosProtocoloPaciente = {
    protocolo_id: Number(row.protocolo_id),
    regimen: Number(row.regimen),
    ciclo_actual_id: Number(row.ciclo_actual_id),
    fecha_inicio: row.fecha_inicio,
    fecha_fin: row.fecha_fin || null,
    estado: row.estado,
    profesional_id_asignador: Number(row.profesional_id_asignador),
    fecha_asignacion: row.fecha_asignacion || new Date().toISOString(),
  };
});

Given(/^ya existe una asignación para el paciente con id "(.*)" con los datos$/, async function (idPaciente, dataTable) {
  const row = dataTable.rowsHash();
  datosProtocoloPaciente = {
    protocolo_id: Number(row.protocolo_id),
    regimen: Number(row.regimen),
    ciclo_actual_id: Number(row.ciclo_actual_id),
    fecha_inicio: row.fecha_inicio,
    fecha_fin: row.fecha_fin || null,
    estado: row.estado,
    profesional_id_asignador: Number(row.profesional_id_asignador),
    fecha_asignacion: row.fecha_asignacion || new Date().toISOString(),
  };

  await request(app)
    .post(`/pacientes/${idPaciente}/protocolos`)
    .send(datosProtocoloPaciente)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
});

Given(/^existe en la base de datos un protocolo asignado al paciente con id "(.*)" con los siguientes datos$/, async function (idPaciente, dataTable) {
  const row = dataTable.rowsHash();
  datosProtocoloPaciente = {
    protocolo_id: Number(row.protocolo_id),
    regimen: Number(row.regimen),
    ciclo_actual_id: Number(row.ciclo_actual_id),
    fecha_inicio: row.fecha_inicio,
    estado: row.estado,
    profesional_id_asignador: Number(row.profesional_id_asignador),
    fecha_asignacion: row.fecha_asignacion || new Date().toISOString(),
  };

  await request(app)
    .post(`/pacientes/${paciente_id}/protocolos`)
    .send(datosProtocoloPaciente)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
});

When(/^intento asignar el mismo protocolo o regimen nuevamente al paciente con id "(.*)"$/, async function (idPaciente) {
  response = await request(app)
    .post(`/pacientes/${idPaciente}/protocolos`)
    .send(datosProtocoloPaciente)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
});

When(/^publico en la API "(.*)" con esos datos$/, async function (endpoint) {
  response = await request(app)
    .post(endpoint)
    .send(datosProtocoloPaciente)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
});

When(/^modifico en el endpoint "(.*)"$/, async function (endpoint) {
  response = await request(app)
    .patch(endpoint)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
});

Then('el protocolo paciente con id {int} tiene ahora ciclo_actual_id {int}, regimen {int}, repeticiones actuales {int} y cambiar_regimen {string}'
  , async function (idProtocoloPaciente, ciclo_esperado, regimen_esperado, repeticionesEsperadas, cambiar_regimen_esperado) {

    const result = await oracleDBInstance.execute(
      'SELECT * FROM protocolo_paciente WHERE protocolo_paciente_id = :protocolo_paciente_id',
      { protocolo_paciente_id: idProtocoloPaciente }
    );

    const protocoloPaciente = result.rows[0];
    assert.strictEqual(ciclo_esperado, protocoloPaciente.CICLO_ACTUAL_ID);
    assert.strictEqual(regimen_esperado, protocoloPaciente.REGIMEN);
    assert.strictEqual(repeticionesEsperadas, protocoloPaciente.REPETICIONES_ACTUALES);
    assert.strictEqual(cambiar_regimen_esperado, protocoloPaciente.CAMBIAR_REGIMEN);
  });

Then(/^la asignación se crea correctamente$/, function () {
  assert.ok(response);
  assert.strictEqual(response.status, 201);
  assert.ok(response.body.protocolo_paciente_id);
});

When(/^consulto la API "(.*)"$/, async function (endpoint) {
  response = await request(app)
    .get(endpoint)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
});

Then(/^el sistema devuelve una lista con al menos un protocolo asignado$/, function () {
  assert.ok(response);
  assert.strictEqual(response.status, 200);
  assert.ok(Array.isArray(response.body));
  assert.ok(response.body.length > 0);
});

Then(/^el sistema devuelve un protocolo con regimen igual a "(.*)"$/, function (regimen) {
  assert.ok(response);
  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body.regimen, Number(regimen));
});

Then(/^el estado es "(.*)"$/, function (estado) {
  assert.strictEqual(response.body.estado, estado);
});

Then(/^el primer protocolo tiene "estado" igual a "(.*)"$/, function (estado) {
  assert.strictEqual(response.body[0].estado, estado);
});

Then(/^el sistema responde con estado "(.*)"$/, function (responseStatus) {
  assert.strictEqual(response.status, Number(responseStatus));
});

Then(/^el error contiene el texto "(.*)"$/, function (mensajeError) {
  assert.ok(response.body.error === mensajeError);
});
