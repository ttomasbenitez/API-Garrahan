import config from '../../config.js';

export class ApiHospitalConector {
  constructor() {
    this.baseUrl = config.app.apiHospitalUrl;
  }

  async obtenerPaciente(id) {
    const response = await fetch(`${this.baseUrl}/fhir/Patient/${id}`);
    if (!response.ok) throw new Error('Error al consultar la API del hospital');

    const fhirData = await response.json();
    return this._normalizarFhir(fhirData);
  }

  _normalizarFhir(fhirData) {
    return {
      nombre: fhirData.name?.[0]?.given?.[0] || null,
      apellido: fhirData.name?.[0]?.family || null,
      id_hospitalario: fhirData.identifier?.[0]?.value || null,
      fecha_nacimiento: fhirData.birthDate || null,
      sexo: fhirData.gender?.[0]?.toUpperCase() || null,
    };
  }
}


const apiHospitalConector = new ApiHospitalConector();
export default apiHospitalConector;
