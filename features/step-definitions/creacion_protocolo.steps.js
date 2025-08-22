const { loadFeature, defineFeature } = require('jest-cucumber');

const feature = loadFeature('features/creacion_protocolo.feature', { tagFilter: 'not @wip' });

defineFeature(feature, (test) => {
  test('US-01.1 Crear un protocolo con todos los campos', ({ given, when, then }) => {
    given(/^quiero crear el protocolo con el nombre de "(.*)"$/, (_nombreProtocolo) => {
      // Implementar la lógica para crear el protocolo
    });

    given(/^enfermedad "(.*)"$/, (_enfermedad) => {
      // Implementar la lógica para crear el protocolo
    });

    given(/^de linea de tratamiento "(.*)"$/, (_lineaTratamiento) => {
      // Implementar la lógica para crear el protocolo
    });

    when('el sistema crea el protocolo', () => {
      // Implementar la lógica para crear el protocolo
    });

    then('el protocolo se crea correctamente', () => {
      // Implementar la lógica para verificar que el protocolo se creó correctamente
    });
    then('puedo consultar el protocolo por enfermedad', () => {
      // Implementar la lógica para verificar que el protocolo se creó correctamente
    });
  });
});
