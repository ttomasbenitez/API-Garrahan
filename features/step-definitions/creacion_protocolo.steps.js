const { loadFeature, defineFeature } = require('jest-cucumber');

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
      // Implementar la lógica para crear el protocolo usando la API
    });

    then('el protocolo se crea correctamente', () => {
      // Implementar la lógica para verificar que el protocolo se creó correctamente
    });
    then('puedo consultar el protocolo por enfermedad', () => {
      // Implementar la lógica para verificar que el protocolo se creó correctamente
    });
  });
});
