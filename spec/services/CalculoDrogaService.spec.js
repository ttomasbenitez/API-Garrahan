/* global describe, test, jest, expect, beforeEach */
import { CalculoDrogaService } from '../../src/services/CalculoDrogaService.js';

// Mock del repositorio
const mockRepo = {
  getById: jest.fn()
};

describe('CalculoDrogaService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('calcula correctamente la cantidad de droga y unidades', async () => {
    // Datos de ejemplo
    mockRepo.getById.mockResolvedValue({
      FUERZA_VALOR: 50,
      CANTIDAD_DIAS: 4,
      FRECUENCIA_DIARIA: 2,
      FUERZA_UNIDAD: 'mg/m2'
    });
    const service = new CalculoDrogaService(mockRepo);
    const result = await service.calcular({
      administracion_id: 1,
      imc: 10,
      nueva_fuerza_valor: 500,
      nueva_fuerza_unidad: 'mg/m2'
    });
    expect(result.cantidad_base).toBe(400); // 50*4*2
    expect(result.cantidad_total).toBe(4000); // 400*10
    expect(result.unidades).toBe(8); // 4000/500
    expect(result.fuerza_unidad).toBe('mg/m2');
    expect(result.nueva_fuerza_valor).toBe(500);
  });

  test('lanza error si no encuentra la administracion', async () => {
    mockRepo.getById.mockResolvedValue(null);
    const service = new CalculoDrogaService(mockRepo);
    await expect(service.calcular({ administracion_id: 99, imc: 10, nueva_fuerza_valor: 500, nueva_fuerza_unidad: 'mg/m2' }))
      .rejects.toThrow('Administración no encontrada');
  });
});
