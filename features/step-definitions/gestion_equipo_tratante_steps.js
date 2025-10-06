import { Given, When, Then, Before } from '@cucumber/cucumber';
import request from 'supertest';
import app from '../../src/app.js';
import assert from 'node:assert/strict';

Before(function () {
  this.paciente = {};
  this.profesionalPrincipal = {};
  this.profesionalColaborador = {};
  this.response = null;
  this.equipoTratante = [];
});

Then('el profesional queda asignado automáticamente como "Médico Tratante"', async function () {
  if (!this.response || !this.response.body || !this.response.body.id) {
    throw new Error('No se pudo obtener el ID del paciente creado');
  }

  const pacienteId = this.response.body.id;
  
  // Consultar el equipo tratante
  const equipoResponse = await request(app)
    .get(`/paciente/${pacienteId}/equipo-tratante`)
    .set('Accept', 'application/json');

  if (equipoResponse.status !== 200) {
    throw new Error(`Error al obtener equipo tratante: ${equipoResponse.status}`);
  }

  const equipo = equipoResponse.body;
  
  // Verificar que hay al menos un profesional asignado
  if (!Array.isArray(equipo) || equipo.length === 0) {
    throw new Error('No se encontró ningún profesional asignado automáticamente');
  }

  // Verificar que el profesional asignado es el que creó el paciente
  const profesionalAsignado = equipo.find(p => p.profesional_id === this.paciente.profesional_id);
  if (!profesionalAsignado) {
    throw new Error(`El profesional ${this.paciente.profesional_id} no está asignado al paciente`);
  }

  // Verificar el rol por defecto
  if (profesionalAsignado.rol !== 'Médico Tratante') {
    throw new Error(`Rol esperado 'Médico Tratante', recibido '${profesionalAsignado.rol}'`);
  }
});

Given('existe un paciente creado por un profesional', async function () {
  // Crear profesional principal
  const profResponse = await request(app)
    .post('/profesional')
    .send({
      nombre: 'Dr. Principal',
      apellido: 'García',
      dni: "12345678",
      dni: '12345678',
      matricula: 'MAT123',
      especialidad: 'Cardiología'
    })
    .set('Accept', 'application/json');
  
  this.profesionalPrincipal.id = profResponse.body.id;

  // Crear paciente
  const pacResponse = await request(app)
    .post('/paciente')
    .send({
      nombre: 'Juan',
      apellido: 'Pérez',
      dni: "12345678",
      id_hospitalario: 'P12345',
      fecha_nacimiento: '2020-05-21',
      peso: 30,
      sexo: 'M',
      profesional_id: this.profesionalPrincipal.id
    })
    .set('Accept', 'application/json');
  
  this.paciente.id = pacResponse.body.id;
});

Given('existe otro profesional disponible', async function () {
  const response = await request(app)
    .post('/profesional')
    .send({
      nombre: 'Dr. Colaborador',
      apellido: 'López',
      dni: "12345678",
      dni: '87654321',
      matricula: 'MAT456',
      especialidad: 'Neurología'
    })
    .set('Accept', 'application/json');
  
  this.profesionalColaborador.id = response.body.id;
});

When('agrego el segundo profesional como colaborador del paciente', async function () {
  this.response = await request(app)
    .post('/paciente-profesional/agregar-colaborador')
    .send({
      profesional_id: this.profesionalColaborador.id,
      paciente_id: this.paciente.id,
      rol: 'Colaborador'
    })
    .set('Accept', 'application/json');
});

Then('el profesional se agrega correctamente al equipo tratante', function () {
  if (!this.response) throw new Error('No hay respuesta');
  if (this.response.status !== 201) {
    throw new Error(`Status esperado 201, recibido ${this.response.status}: ${this.response.body?.error}`);
  }
});

Then('el paciente tiene 2 profesionales asignados', async function () {
  const equipoResponse = await request(app)
    .get(`/paciente/${this.paciente.id}/equipo-tratante`)
    .set('Accept', 'application/json');

  this.equipoTratante = equipoResponse.body;
  
  if (this.equipoTratante.length !== 2) {
    throw new Error(`Esperados 2 profesionales, encontrados ${this.equipoTratante.length}`);
  }
});

Given('existe un paciente con un profesional asignado', async function () {
  await this.steps('Given existe un paciente creado por un profesional');
});

When('cambio el profesional principal del paciente', async function () {
  this.response = await request(app)
    .put(`/paciente-profesional/paciente/${this.paciente.id}/profesional-principal`)
    .send({
      nuevo_profesional_id: this.profesionalColaborador.id
    })
    .set('Accept', 'application/json');
});

Then('el profesional principal se actualiza correctamente', function () {
  if (!this.response) throw new Error('No hay respuesta');
  if (this.response.status !== 200) {
    throw new Error(`Status esperado 200, recibido ${this.response.status}: ${this.response.body?.error}`);
  }
});

Then('solo queda el nuevo profesional como "Médico Tratante"', async function () {
  const equipoResponse = await request(app)
    .get(`/paciente/${this.paciente.id}/equipo-tratante`)
    .set('Accept', 'application/json');

  const equipo = equipoResponse.body;
  
  if (equipo.length !== 1) {
    throw new Error(`Esperado 1 profesional, encontrados ${equipo.length}`);
  }

  const medicaTratante = equipo[0];
  if (medicaTratante.profesional_id !== this.profesionalColaborador.id) {
    throw new Error('El nuevo profesional no es el médico tratante');
  }

  if (medicaTratante.rol !== 'Médico Tratante') {
    throw new Error(`Rol esperado 'Médico Tratante', recibido '${medicaTratante.rol}'`);
  }
});

Given('existe un profesional con pacientes asignados', async function () {
  // Crear profesional principal
  const profesionalResponse = await request(app)
    .post('/profesional')
    .send({
      nombre: 'Dr. Principal',
      apellido: 'Medico',
      dni: "12345678",
      especialidad: 'Oncología',
      matricula: '12345'
    })
    .set('Accept', 'application/json');

  this.profesionalPrincipal = profesionalResponse.body;

  // Crear paciente
  const pacienteResponse = await request(app)
    .post('/paciente')
    .send({
      nombre: 'Paciente',
      apellido: 'Test',
      dni: "12345678",
      id_hospitalario: `P-${Date.now()}`,
      fecha_nacimiento: '2010-01-01',
      peso: 25,
      sexo: 'M',
      profesional_id: this.profesionalPrincipal.id
    })
    .set('Accept', 'application/json');

  this.paciente = pacienteResponse.body;
});

When('consulto los pacientes del profesional', async function () {
  this.response = await request(app)
    .get(`/paciente-profesional/profesional/${this.profesionalPrincipal.id}/pacientes`)
    .set('Accept', 'application/json');
});

Then('obtengo la lista de todos sus pacientes', function () {
  if (!this.response) throw new Error('No hay respuesta');
  if (this.response.status !== 200) {
    throw new Error(`Status esperado 200, recibido ${this.response.status}`);
  }

  const pacientes = this.response.body;
  if (!Array.isArray(pacientes) || pacientes.length === 0) {
    throw new Error('No se encontraron pacientes');
  }
});

Given('existe un paciente con profesional principal', async function () {
  // Crear profesional principal
  const profesionalResponse = await request(app)
    .post('/profesional')
    .send({
      nombre: 'Dr. Principal',
      apellido: 'Medico',
      dni: "12345678",
      especialidad: 'Oncología',
      matricula: '12345'
    })
    .set('Accept', 'application/json');

  this.profesionalPrincipal = profesionalResponse.body;

  // Crear paciente
  const pacienteResponse = await request(app)
    .post('/paciente')
    .send({
      nombre: 'Paciente',
      apellido: 'Test',
      dni: "12345678",
      id_hospitalario: `P-${Date.now()}`,
      fecha_nacimiento: '2010-01-01',
      peso: 25,
      sexo: 'M',
      profesional_id: this.profesionalPrincipal.id
    })
    .set('Accept', 'application/json');

  this.paciente = pacienteResponse.body;
});

Given('tiene un profesional colaborador agregado', async function () {
  // Crear otro profesional
  const profesionalColaboradorResponse = await request(app)
    .post('/profesional')
    .send({
      nombre: 'Dr. Colaborador',
      apellido: 'Especialista',
      dni: "12345678",
      especialidad: 'Cardiología',
      matricula: '67890'
    })
    .set('Accept', 'application/json');

  this.profesionalColaborador = profesionalColaboradorResponse.body;

  // Agregarlo como colaborador
  await request(app)
    .post('/paciente-profesional/agregar-colaborador')
    .send({
      profesional_id: this.profesionalColaborador.id,
      paciente_id: this.paciente.id,
      rol: 'Colaborador'
    })
    .set('Accept', 'application/json');
});

When('consulto el equipo tratante del paciente', async function () {
  this.response = await request(app)
    .get(`/paciente/${this.paciente.id}/equipo-tratante`)
    .set('Accept', 'application/json');
});

Then('obtengo la lista completa de profesionales', function () {
  if (!this.response) throw new Error('No hay respuesta');
  if (this.response.status !== 200) {
    throw new Error(`Status esperado 200, recibido ${this.response.status}`);
  }

  this.equipoTratante = this.response.body;
  if (!Array.isArray(this.equipoTratante) || this.equipoTratante.length === 0) {
    throw new Error('No se encontraron profesionales en el equipo');
  }
});

Then('cada profesional tiene su rol correspondiente', function () {
  const roles = this.equipoTratante.map(p => p.rol);
  if (!roles.includes('Médico Tratante')) {
    throw new Error('No se encontró el médico tratante');
  }
});

Given('existe un paciente con su médico tratante', async function () {
  await this.steps('Given existe un paciente creado por un profesional');
});

When('intento remover al médico tratante como colaborador', async function () {
  this.response = await request(app)
    .delete(`/paciente-profesional/profesional/${this.profesionalPrincipal.id}/paciente/${this.paciente.id}`)
    .set('Accept', 'application/json');
});

Then('obtengo un error indicando que no se puede remover', function () {
  if (!this.response) throw new Error('No hay respuesta');
  if (this.response.status !== 400) {
    throw new Error(`Status esperado 400, recibido ${this.response.status}`);
  }

  if (!this.response.body.error.includes('médico tratante')) {
    throw new Error('El error no menciona que es el médico tratante');
  }
});

When('intento agregar el mismo profesional como colaborador', async function () {
  this.response = await request(app)
    .post('/paciente-profesional/agregar-colaborador')
    .send({
      profesional_id: this.profesionalPrincipal.id,
      paciente_id: this.paciente.id,
      rol: 'Colaborador'
    })
    .set('Accept', 'application/json');
});

Then('obtengo un error indicando que ya está asignado', function () {
  if (!this.response) throw new Error('No hay respuesta');
  if (this.response.status !== 400) {
    throw new Error(`Status esperado 400, recibido ${this.response.status}`);
  }

  if (!this.response.body.error.includes('ya está asignado')) {
    throw new Error('El error no indica que ya está asignado');
  }
});

Given('que existe un paciente con nombre {string} y apellido {string}', async function (nombre, apellido) {
  // Crear profesional primero
  const profesionalResponse = await request(app)
    .post('/profesional')
    .send({
      nombre: 'Dr. Principal',
      apellido: 'Medico',
      dni: "12345678",
      especialidad: 'Oncología',
      matricula: '12345'
    })
    .set('Accept', 'application/json');


  this.profesionalPrincipal = profesionalResponse.body;

  // Crear paciente
  const pacientePayload = {
    nombre,
    apellido,
    id_hospitalario: `P-${Date.now()}`,
    fecha_nacimiento: '2010-01-01',
    peso: 25,
    sexo: 'M',
    profesional_id: this.profesionalPrincipal.id
  };
  

  const pacienteResponse = await request(app)
    .post('/paciente')
    .send(pacientePayload)
    .set('Accept', 'application/json');


  if (pacienteResponse.status !== 201) {
    throw new Error(`Error al crear paciente: ${pacienteResponse.status} - ${pacienteResponse.body.error}`);
  }

  this.paciente = pacienteResponse.body;
});

Given('el paciente tiene al profesional con id {int} como médico tratante', async function (profesionalId) {
  // El profesional ya está asignado como médico tratante al crear el paciente
  // Solo verificamos que efectivamente esté asignado
  
  
  const equipoResponse = await request(app)
    .get(`/paciente-profesional/paciente/${this.paciente.id}/equipo`)
    .set('Accept', 'application/json');


  if (equipoResponse.status !== 200) {
    throw new Error(`Error al obtener equipo: ${equipoResponse.status}`);
  }

  const equipo = equipoResponse.body;
  
  if (!Array.isArray(equipo)) {
    throw new Error(`Equipo no es un array: ${typeof equipo}`);
  }
  
  const medicoTratante = equipo.find(p => p.rol === 'Médico Tratante');
  
  if (!medicoTratante) {
    throw new Error('No se encontró médico tratante asignado');
  }
});

Given('el paciente tiene al profesional con id {int} como consultor', async function (profesionalId) {
  // Crear otro profesional para ser consultor
  const profesionalResponse = await request(app)
    .post('/profesional')
    .send({
      nombre: 'Dr. Consultor',
      apellido: 'Especialista',
      dni: "12345678",
      especialidad: 'Cardiología',
      matricula: '67890'
    })
    .set('Accept', 'application/json');

  this.profesionalConsultor = profesionalResponse.body;

  // Agregarlo como consultor
  await request(app)
    .post('/paciente-profesional/agregar-colaborador')
    .send({
      profesional_id: this.profesionalConsultor.id,
      paciente_id: this.paciente.id,
      rol: 'Consultor'
    })
    .set('Accept', 'application/json');
});

When('cambio el profesional principal del paciente al profesional con id {int}', async function (nuevoProfesionalId) {
  // Crear nuevo profesional principal
  const nuevoProfesionalResponse = await request(app)
    .post('/profesional')
    .send({
      nombre: 'Dr. Nuevo',
      apellido: 'Principal',
      dni: "12345678",
      especialidad: 'Neurología',
      matricula: '11111'
    })
    .set('Accept', 'application/json');

  this.nuevoProfesional = nuevoProfesionalResponse.body;

  // Cambiar profesional principal
  this.response = await request(app)
    .put(`/paciente-profesional/paciente/${this.paciente.id}/profesional-principal`)
    .send({
      nuevo_profesional_id: this.nuevoProfesional.id
    })
    .set('Accept', 'application/json');
});

Then('el paciente debe tener al profesional con id {int} como médico tratante', async function (profesionalId) {
  const equipoResponse = await request(app)
    .get(`/paciente-profesional/paciente/${this.paciente.id}/equipo`)
    .set('Accept', 'application/json');

  const equipo = equipoResponse.body;
  const medicoTratante = equipo.find(p => p.rol === 'Médico Tratante');
  
  if (!medicoTratante || medicoTratante.profesional_id !== this.nuevoProfesional.id) {
    throw new Error(`El nuevo profesional no es el médico tratante actual`);
  }
});

Then('el paciente debe mantener al profesional con id {int} como consultor', async function (profesionalId) {
  const equipoResponse = await request(app)
    .get(`/paciente-profesional/paciente/${this.paciente.id}/equipo`)
    .set('Accept', 'application/json');

  const equipo = equipoResponse.body;
  const consultor = equipo.find(p => p.rol === 'Consultor' && p.profesional_id === this.profesionalConsultor.id);
  
  if (!consultor) {
    throw new Error('El consultor no se mantuvo asignado');
  }
});

Then('el profesional con id {int} no debe estar asignado al paciente', async function (profesionalId) {
  const equipoResponse = await request(app)
    .get(`/paciente-profesional/paciente/${this.paciente.id}/equipo`)
    .set('Accept', 'application/json');

  const equipo = equipoResponse.body;
  const profesionalAnterior = equipo.find(p => p.profesional_id === this.profesionalPrincipal.id);
  
  if (profesionalAnterior) {
    throw new Error('El profesional anterior todavía está asignado');
  }
});

When('intento agregar al profesional con id {int} como consultor del paciente', async function (profesionalId) {
  this.response = await request(app)
    .post('/paciente-profesional/agregar-colaborador')
    .send({
      profesional_id: profesionalId,
      paciente_id: this.paciente.id,
      rol: 'Consultor'
    })
    .set('Accept', 'application/json');
});

Then('debo recibir un error indicando que el profesional no existe', function () {
  if (!this.response) throw new Error('No hay respuesta');
  if (this.response.status !== 500) {
    throw new Error(`Status esperado 500, recibido ${this.response.status}`);
  }

  if (!this.response.body.error.includes('no encontrado') && !this.response.body.error.includes('no existe')) {
    throw new Error('El error no indica que el profesional no existe');
  }
});

Then('debo recibir un error indicando que el profesional ya está asignado', function () {
  if (!this.response) throw new Error('No hay respuesta');
  if (this.response.status !== 400) {
    throw new Error(`Status esperado 400, recibido ${this.response.status}`);
  }

  if (!this.response.body.error.includes('ya está asignado')) {
    throw new Error('El error no indica que el profesional ya está asignado');
  }
});