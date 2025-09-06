import app from '../../src/app.js';
import request from 'supertest';
const { loadFeature, defineFeature, expect  } = require('jest-cucumber');

const feature = loadFeature('features/creacion_protocolo.feature', { tagFilter: 'not @wip' });

defineFeature(feature, (test) => {
  test('US-01.1 Crear un protocolo con todos los campos', ({ given, when, then }) => {
    const protocolo = {};
    given(/^quiero crear el protocolo con el nombre de "(.*)"$/, nombreProtocolo => {
      protocolo.nombre = nombreProtocolo;
    });

    given(/^enfermedad "(.*)"$/, (enfermedad) => {
      protocolo.enfermedad = enfermedad;
    });

    given(/^de linea de tratamiento "(.*)"$/, (lineaTratamiento) => {
      protocolo.linea = lineaTratamiento;
    });

    when(/^publico en la API "(.*)" con los datos$/, async () => {
      const response = await request(app)
        .post('/protocolo')
        .send(protocolo)
        .set('Accept', 'application/json');
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('protocolo_id');
      protocolo.id = response.body.protocolo_id;
    });

    then('el protocolo se crea correctamente', () => {
      // Implementar la lógica para verificar que el protocolo se creó correctamente
    });
    then('puedo consultar el protocolo por enfermedad', () => {
      // Implementar la lógica para verificar que el protocolo se creó correctamente
    });
  });
});
