// ... importaciones y variables existentes ...
import { Given, When, Then } from '@cucumber/cucumber';
import request from 'supertest';
import app from '../../src/app.js';
import assert from 'node:assert/strict';

let response;
// Variables para IDs generados en el background
let createdDrogaId;
let createdViaId;
let createdPresentacionId;
let createdProtocoloId;
let createdPacienteId;
let createdAdminId;
// Variables de contexto para el Ciclo

// Paso 1.1: Droga
Given(/^existe una Droga con nombre "(.*)" y droga_id (\d+)$/, async function (nombre, id) {
  const data = { nombre_generico: nombre, droga_id: parseInt(id, 10) };
  const createResponse = await request(app)
    .post('/drogas')
    .send(data)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);

  const droga = Array.isArray(createResponse.body) ? createResponse.body[0] : createResponse.body;
  createdDrogaId = droga.droga_id;
  this.drogaId = createdDrogaId; // Guardar en el contexto para referencias
});

// Paso 1.2: Forma Farmacéutica
Given(/^existe una FormaFarmaceutica con nombre "(.*)", código "(.*)" y forma_farmaceutica_id (\d+)$/, async function (nombre, codigo, _id) {
  const data = { nombre: nombre, codigo: codigo };
  await request(app)
    .post('/formas-farmaceuticas')
    .send(data)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
});

// Paso 1.3: Vía de Administración
Given(/^existe una ViaAdministracion con nombre "(.*)", código "(.*)" y via_id (\d+)$/, async function (nombre, codigo, _id) {
  const data = { nombre: nombre, codigo: codigo };
  const createResponse = await request(app)
    .post('/vias-administracion')
    .send(data)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);

  const via = Array.isArray(createResponse.body) ? createResponse.body[0] : createResponse.body;
  createdViaId = via.via_id;
  this.viaId = createdViaId;
});

// Paso 1.4: Presentación de Droga
Given(/^existe una PresentacionDroga con presentacion_id (\d+), droga_id (\d+), forma_farmaceutica_id (\d+), codigo_farmacia "(.*)", fuerza_valor (\d+) y fuerza_unidad "(.*)"$/, async function (presId, dId, fId, cFarmacia, fVal, fUnid) {
  const data = {
    presentacion_id: parseInt(presId, 10),
    droga_id: parseInt(dId, 10),
    forma_farmaceutica_id: parseInt(fId, 10),
    codigo_farmacia: cFarmacia,
    fuerza_valor: parseFloat(fVal),
    fuerza_unidad: fUnid
  };

  const createResponse = await request(app)
    .post(`/drogas/${data.droga_id}/presentaciones`)
    .send([data])
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);


  const presentacion = Array.isArray(createResponse.body) ? createResponse.body[0] : createResponse.body;
  createdPresentacionId = presentacion.presentacion_id;
  this.presentacionId = createdPresentacionId;
});

// Paso 1.5: Presentación Droga Vía (como 'default')
Given(/^existe una PresentacionDrogaVia para la via_id (\d+) y presentacion_id (\d+)$/, async function (vId, pId) {
  const data = {
    via_id: parseInt(vId, 10),
    presentacion_id: parseInt(pId, 10),
    es_default: '1'
  };

  response = await request(app)
    .post('/presentaciones-droga-via')
    .send(data)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
});

Given(/^existe un Paciente con paciente_id (\d+) y nombre "(.*)"$/, async function (id, nombre) {
  const data = {
    paciente_id: parseInt(id, 10),
    nombre: nombre,
    apellido: 'TEST_APELLIDO',
    id_hospitalario: `HOS-${id}`,
    sexo: 'M'
  };

  const createResponse = await request(app)
    .post('/pacientes')
    .send(data)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);

  const paciente = Array.isArray(createResponse.body) ? createResponse.body[0] : createResponse.body;
  createdPacienteId = paciente.paciente_id;
  this.pacienteId = createdPacienteId;
});

Given(/^existe un Protocolo con protocolo_id (\d+) y nombre "(.*)"$/, async function (id, nombre) {
  const data = {
    protocolo_id: parseInt(id, 10),
    nombre: nombre,
    enfermedad: 'TEST_ENFERMEDAD',
    linea: 'TEST_LINEA',
    cantidad_regimenes: 2,
  };

  const createResponse = await request(app)
    .post('/protocolos')
    .send(data)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);

  const protocolo = Array.isArray(createResponse.body) ? createResponse.body[0] : createResponse.body;
  createdProtocoloId = protocolo.protocolo_id;
  this.protocoloId = createdProtocoloId;
});

Given(/^el Protocolo (\d+) incluye un Ciclo {ciclo_id: (\d+), regimen: (\d+), duracion_semanas: (\d+)}$/, async function (pId, cId, rId, duracion) {
  const data = {
    protocolo_id: parseInt(pId, 10),
    ciclo_id: parseInt(cId, 10),
    regimen: parseInt(rId, 10),
    duracion_semanas: parseInt(duracion, 10),
    ciclo_final: '0',
    repeticiones: 0
  };

  response = await request(app)
    .post(`/protocolos/${data.protocolo_id}/ciclos`)
    .send(data)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
});

Given(/^el Ciclo {protocolo_id: (\d+), ciclo_id: (\d+), regimen: (\d+)} tiene una AdministracionMedicacion:$/, async function (pId, cId, rId, dataTable) {
  const data = dataTable.rowsHash();

  const adminData = {
    protocolo_id: parseInt(pId, 10),
    ciclo_id: parseInt(cId, 10),
    regimen: parseInt(rId, 10),
    droga_id: parseInt(data.droga_id, 10),
    via_id: parseInt(data.via_id, 10),
    fuerza_valor: parseFloat(data.fuerza_valor),
    fuerza_unidad: data.fuerza_unidad,
    cantidad_dias: 1,
    frecuencia_diaria: 1
  };

  const createResponse = await request(app)
    .post(`/protocolos/${adminData.protocolo_id}/ciclos/${adminData.ciclo_id}/regimenes/${adminData.regimen}/administraciones`)
    .send(adminData)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);

  createdAdminId = createResponse.body.admin_id;
  this.adminId = createdAdminId;
});

Given(/^el Paciente (\d+) tiene asignado el Protocolo (\d+), Regimen (\d+), y está en el Ciclo Actual (\d+)$/, async function (pacId, protId, regId, cId) {
  const data = {
    paciente_id: parseInt(pacId, 10),
    protocolo_id: parseInt(protId, 10),
    regimen: parseInt(regId, 10),
    ciclo_actual_id: parseInt(cId, 10),
    numero_ciclo: 1,
    estado: 'ACTIVO',
    fecha_asignacion: new Date().toISOString().split('T')[0]
  };

  response = await request(app)
    .post(`/pacientes/${data.paciente_id}/protocolos`)
    .send(data)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
});

Given('el Paciente {int} no tiene ningún Protocolo asignado en protocolo_paciente', function (_pacId) {
});

When(/^el usuario consulta el endpoint GET \/pacientes\/(\d+)\/protocolo-actual$/, async function (pacId) {
  response = await request(app)
    .get(`/pacientes/${pacId}/protocolo-actual`)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
});

Then(/^la respuesta debe ser exitosa \(código 200\)$/, function () {
  assert.ok(response);
  assert.strictEqual(response.status, 200);
});

Then(/^la respuesta debe incluir el Protocolo "(.*)" con protocolo_id (\d+)$/, function (nombre, id) {
  assert.strictEqual(response.body.protocolo_id, parseInt(id, 10));
  assert.strictEqual(response.body.nombre, nombre);
});

Then(/^la respuesta debe indicar el Ciclo Actual (\d+) y Regimen (\d+)$/, function (cId, rId) {
  assert.strictEqual(response.body.ciclo_actual_id, parseInt(cId, 10));
  assert.strictEqual(response.body.regimen, parseInt(rId, 10));
});

Then(/^la respuesta debe contener (\d+) Administracion de Medicacion$/, function (cantidad) {
  assert.ok(Array.isArray(response.body.administraciones));
  assert.strictEqual(response.body.administraciones.length, parseInt(cantidad, 10));
});

Then(/^la respuesta debe contener (\d+) Administracion de Medicacion con los siguientes detalles:$/, function (cantidad, dataTable) {
  const expected = dataTable.rowsHash();
  const administraciones = response.body.administraciones;

  assert.ok(Array.isArray(administraciones));
  assert.strictEqual(administraciones.length, parseInt(cantidad, 10));

  const admin = administraciones[0];

  assert.strictEqual(admin.nombre_droga, expected.nombre_droga);
  assert.strictEqual(admin.via_administracion, expected.via_administracion);
  assert.strictEqual(String(admin.fuerza_valor), expected.fuerza_valor);
  assert.strictEqual(admin.fuerza_unidad, expected.fuerza_unidad);
  if (expected.formato_droga === 'NULL') {
    assert.strictEqual(admin.formato_droga, null);
  } else {
    assert.strictEqual(admin.formato_droga, expected.formato_droga);
  }
});


Then(/^la respuesta debe ser de "Recurso no encontrado" \(código 404\)$/, function () {
  assert.ok(response);
  assert.strictEqual(response.status, 404);
});

Then(/^la respuesta debe indicar que "(.*)"$/, function (mensaje) {
  assert.ok(response.body.error.includes(mensaje));
});
