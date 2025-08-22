/* global describe, test, expect */
import Protocolo from '../../src/domain/protocolos/index.js';

describe('Protocolo', () => {
  test('deberia crear un protocolo con todos los campos obligatorios', () => {
    const protocol = new Protocolo('Osteosarcoma GBTO 2006 - No metastásico', 'Osteosarcoma', 'primera linea');
    expect(protocol.nombre).toBe('Osteosarcoma GBTO 2006 - No metastásico');
    expect(protocol.enfermedad).toBe('Osteosarcoma');
    expect(protocol.linea).toBe('primera linea');
  });

  test('deberia obtener un protocolo con todos los campos a partir de un row', () => {
    const row = {
      protocolo_id: 1,
      nombre: 'Osteosarcoma GBTO 2006 - No metastásico',
      enfermedad: 'Osteosarcoma',
      linea: 'primera linea'
    };
    const protocolo = Protocolo.fromRow(row);
    expect(protocolo.nombre).toBe('Osteosarcoma GBTO 2006 - No metastásico');
    expect(protocolo.enfermedad).toBe('Osteosarcoma');
    expect(protocolo.linea).toBe('primera linea');
  });
});
