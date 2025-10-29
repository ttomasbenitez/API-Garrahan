import { Given, When, Then } from '@cucumber/cucumber';
import request from 'supertest';
import app from '../../src/app.js';
import assert from 'node:assert/strict';
import ExcelJS from 'exceljs';
import { RecetaHospitalariaExportador } from '../../src/domain/receta/recetaHospitalariaExportador.js';

let response = null;
let textoExcel = null;

When('consulto la API {string} para generar la receta médica', async function (endpoint) {
  await request(app)
    .get(endpoint)
    .set('Accept', 'application/json')
    .set('Cookie', this.sessionCookie)
    .then(function (res) {
      response = res;
    });
});

Then('la respuesta tiene código de estado {string}', function (codigo) {
  assert.equal(response.status.toString(), codigo);
});


Then('el cuerpo de la respuesta contiene un archivo Excel', async function () {
  const recetaExporter = new RecetaHospitalariaExportador();
  textoExcel = await recetaExporter.cargar(response.body);
});

Then('el archivo contiene {string}', function (valor) {
  assert.ok(textoExcel.includes(valor), `El archivo no contiene el valor esperado: ${valor}`);
});
