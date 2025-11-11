import { Given, When, Then } from '@cucumber/cucumber';
import request from 'supertest';
import app from '../../src/app.js';
import assert from 'node:assert/strict';

let response = {};
let calculoData = {};
let administracionId = null;

Given('existe la administración de medicación:', async function (dataTable) {
  const admin = dataTable.rowsHash();

  const res = await request(app)
    .post('/protocolos/1/ciclos/1/regimenes/1/administraciones')
    .send([admin])
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);

  // Extraer el ID de la administración creada
  administracionId = res.body.ciclos[0].administracion_medicacion[0].id;
});

When('calculo la droga con los siguientes datos:', async function (dataTable) {
  calculoData = dataTable.rowsHash();

  // Usar el ID de la administración creada si no se especifica
  if (administracionId && !calculoData.administracion_id) {
    calculoData.administracion_id = administracionId;
  }

  // Si se especificó un ID en la tabla, usarlo
  if (calculoData.administracion_id) {
    calculoData.administracion_id = parseInt(calculoData.administracion_id, 10);
  }

  calculoData.peso = parseFloat(calculoData.peso);
  calculoData.nueva_fuerza_valor = parseFloat(calculoData.nueva_fuerza_valor);

  response = await request(app)
    .post('/calculo/calculo-droga')
    .send(calculoData)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
});

When('intento calcular con una administración inexistente:', async function (dataTable) {
  calculoData = dataTable.rowsHash();

  calculoData.administracion_id = parseInt(calculoData.administracion_id, 10);
  calculoData.peso = parseFloat(calculoData.peso);
  calculoData.nueva_fuerza_valor = parseFloat(calculoData.nueva_fuerza_valor);

  response = await request(app)
    .post('/calculo/calculo-droga')
    .send(calculoData)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie);
});

Then(/^la dosis diaria es aproximadamente "(.*)" "(.*)"$/, function (valor, unidad) {
  assert.ok(response.body.dosis_diaria);
  assert.strictEqual(response.body.dosis_diaria.unidad, unidad);

  const valorCalculado = parseFloat(response.body.dosis_diaria.valor);
  const valorEsperado = parseFloat(valor);

  // Tolerancia de 0.5 para diferencias de redondeo
  const diferencia = Math.abs(valorCalculado - valorEsperado);
  assert.ok(diferencia < 0.5,
    `Dosis diaria esperada: ${valorEsperado}, obtenida: ${valorCalculado}, diferencia: ${diferencia}`);
});

Then(/^la dosis diaria es exactamente "(.*)" "(.*)"$/, function (valor, unidad) {
  assert.ok(response.body.dosis_diaria);
  assert.strictEqual(response.body.dosis_diaria.unidad, unidad);
  assert.strictEqual(response.body.dosis_diaria.valor, valor);
});

Then(/^la cantidad total es aproximadamente "(.*)" "(.*)"$/, function (valor, unidad) {
  assert.ok(response.body.cantidad_total);
  assert.strictEqual(response.body.cantidad_total.unidad, unidad);

  const valorCalculado = parseFloat(response.body.cantidad_total.valor);
  const valorEsperado = parseFloat(valor);

  // Tolerancia de 0.5 para diferencias de redondeo
  const diferencia = Math.abs(valorCalculado - valorEsperado);
  assert.ok(diferencia < 0.5,
    `Cantidad total esperada: ${valorEsperado}, obtenida: ${valorCalculado}, diferencia: ${diferencia}`);
});

Then(/^las unidades calculadas son "(.*)"$/, function (unidades) {
  assert.ok(Object.prototype.hasOwnProperty.call(response.body, 'unidades'));
  assert.strictEqual(response.body.unidades, parseInt(unidades, 10));
});

Then('el sistema aplica el límite máximo de VINCRISTINA', function () {
  // Verificar que la dosis diaria es exactamente 2mg
  assert.ok(response.body.dosis_diaria);
  assert.strictEqual(response.body.dosis_diaria.valor, '2.00');
});

Then(/^el cálculo falla con error "(.*)"$/, function (mensajeError) {
  assert.ok(response.status >= 400);
  assert.ok(response.body.error);
  assert.ok(response.body.error.includes(mensajeError));
});
