import { ERROR_DNI_NO_ENCONTRADO_CODE } from '../errors/profesional.js';

export class ProfesionalService {
  constructor(profesionalRepo, apiHospitalConector) {
    this.profesionalRepo = profesionalRepo;
    this.apiHospitalConector = apiHospitalConector;
  }

  async crear(profesional) {
    const id = await this.profesionalRepo.guardar(profesional);
    profesional.profesional_id = id;
    return id;
  }

  async obtener(id) { return this.profesionalRepo.obtener(id); }

  async obtenerTodos() { return this.profesionalRepo.obtenerTodos(); }

  async obtenerExterno(dni) {
    let profesional;
    try {
      profesional = await this.apiHospitalConector.obtenerProfesional(dni);
      const profesionalLocal = await this.profesionalRepo.obtenerPorDni(dni);
      profesional.profesional_id = profesionalLocal.profesional_id;
      return profesional;
    } catch (error) {
      if (error.code === ERROR_DNI_NO_ENCONTRADO_CODE && profesional) {
        await this.crear(profesional);
      } else {
        throw error;
      }
    }
  }
}
