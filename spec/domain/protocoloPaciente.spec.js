/* global describe, test, expect */
import ProtocoloPaciente from '../../src/domain/protocoloPaciente.js';

describe('ProtocoloPaciente', () => {
  test('debería crear correctamente un protocolo-paciente con los campos obligatorios', () => {
    const pp = new ProtocoloPaciente({
      paciente_id: 1,
      protocolo_id: 10,
      regimen: 2,
      ciclo_actual_id: 5,
      profesional_id_asignador: 3,
      estado: 'Activo'
    });

    expect(pp.paciente_id).toBe(1);
    expect(pp.protocolo_id).toBe(10);
    expect(pp.regimen).toBe(2);
    expect(pp.ciclo_actual_id).toBe(5);
    expect(pp.profesional_id_asignador).toBe(3);
    expect(pp.estado).toBe('Activo');
  });

  test('debería lanzar error si falta paciente_id', () => {
    expect(() => {
      new ProtocoloPaciente({ protocolo_id: 10, regimen: 2, ciclo_actual_id: 5 });
    }).toThrow('paciente_id es obligatorio');
  });

  test('debería lanzar error si falta protocolo_id', () => {
    expect(() => {
      new ProtocoloPaciente({ paciente_id: 1, regimen: 2, ciclo_actual_id: 5 });
    }).toThrow('protocolo_id es obligatorio');
  });

  test('debería lanzar error si falta regimen', () => {
    expect(() => {
      new ProtocoloPaciente({ paciente_id: 1, protocolo_id: 10, ciclo_actual_id: 5 });
    }).toThrow('regimen es obligatorio');
  });

  test('debería lanzar error si falta ciclo_actual_id', () => {
    expect(() => {
      new ProtocoloPaciente({ paciente_id: 1, protocolo_id: 10, regimen: 2 });
    }).toThrow('ciclo_actual_id es obligatorio');
  });
});
