/* global describe, test, expect */

import RecetaPaciente from '../../src/domain/receta/recetaPaciente.js';

describe('RecetaPaciente', () => {

  const crearRecetaPaciente = () => {
    const body = {
      nombre: 'Juan',
      apellido: 'Pérez',
      tipo_documento: 'DNI',
      numero_documento: '40123456',
      fecha_nacimiento: '2020-05-21',
      sexo: 'M',
      nacionalidad: 'Argentina',
      domicilio_calle: 'Av. Corrientes',
      domicilio_numero: '1234',
      localidad: 'CABA',
      telefono: '1122334455',
      email: 'juan.perez@example.com',
      peso: 70,
      talla: 175,
      superficie_corporal: 1.8,
      diagnostico: 'Leucemia Linfoblástica Aguda',
      numero_ciclo: 1,
      protocolo_id: 1,
      ciclo_id: 1,
      regimen: 1,
      paciente_id: 1,
      profesional_id: 2,
      estado: 'Activo'
    };

    const recetaPaciente = RecetaPaciente.fromBody(body);
    return recetaPaciente;
  };
  test('debería crear correctamente una receta para cierto paciente con los campos obligatorios', () => {

    const recetaPaciente = crearRecetaPaciente();

    expect(recetaPaciente.paciente_snapshot.identidad.nombre).toBe('Juan');
    expect(recetaPaciente.paciente_snapshot.identidad.apellido).toBe('Pérez');
    expect(recetaPaciente.paciente_snapshot.identidad.tipo_documento).toBe('DNI');
    expect(recetaPaciente.paciente_snapshot.identidad.numero_documento).toBe('40123456');
    expect(recetaPaciente.paciente_snapshot.identidad.fecha_nacimiento).toEqual(new Date('2020-05-21'));
    expect(recetaPaciente.paciente_snapshot.identidad.sexo).toBe('M');
    expect(recetaPaciente.paciente_snapshot.identidad.nacionalidad).toBe('Argentina');
    expect(recetaPaciente.paciente_snapshot.domicilio.calle).toBe('Av. Corrientes');
    expect(recetaPaciente.paciente_snapshot.domicilio.numero).toBe('1234');
    expect(recetaPaciente.paciente_snapshot.domicilio.localidad).toBe('CABA');
    expect(recetaPaciente.paciente_snapshot.contacto.telefono).toBe('1122334455');
    expect(recetaPaciente.contexto.protocolo_id).toBe(1);
    expect(recetaPaciente.contexto.ciclo_id).toBe(1);
    expect(recetaPaciente.contexto.regimen).toBe(1);
    expect(recetaPaciente.contexto.numero_ciclo).toBe(1);
    expect(recetaPaciente.datos_paciente.peso).toBe(70);
    expect(recetaPaciente.datos_paciente.talla).toBe(175);
    expect(recetaPaciente.datos_paciente.superficie_corporal).toBe(1.8);
    expect(recetaPaciente.diagnostico).toBe('Leucemia Linfoblástica Aguda');

  });

});
