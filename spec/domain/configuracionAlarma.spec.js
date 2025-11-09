/* global describe, test, expect */
import ConfiguracionAlarma from '../../src/domain/alarma/configuracionAlarma';

describe('ConfiguracionAlarma', () => {
  test('deberia crear una configuracion con todos los campos', () => {
    const fecha = new Date('2025-11-07T10:00:00Z');
    const config = new ConfiguracionAlarma(1, 14, fecha);

    expect(config.configuracion_id).toBe(1);
    expect(config.limite_dias).toBe(14);
    expect(config.ultima_ejecucion).toBe(fecha);
  });

  test('deberia crear una configuracion con valores null por defecto', () => {
    const config = new ConfiguracionAlarma();

    expect(config.configuracion_id).toBeNull();
    expect(config.limite_dias).toBeNull();
    expect(config.ultima_ejecucion).toBeNull();
  });

  test('deberia crear una configuracion solo con limite_dias', () => {
    const config = new ConfiguracionAlarma(null, 30, null);

    expect(config.configuracion_id).toBeNull();
    expect(config.limite_dias).toBe(30);
    expect(config.ultima_ejecucion).toBeNull();
  });
});
