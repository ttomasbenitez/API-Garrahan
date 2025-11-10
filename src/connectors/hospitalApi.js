import config from '../../config.js';
import axios from 'axios';

export class ApiHospitalConector {
  constructor() {
    this.baseUrl = config.app.apiHospitalUrl;
    this.apiClient = this.crearApiClient();
  }

  crearApiClient() {
    const api = axios.create({
      baseURL: this.baseUrl,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return api;
  }

  async obtenerPaciente(id) {
    const response = await this.apiClient.get(`/fhir/Patient/${id}`);
    if (response.status !== 200) {
      throw new Error('Error al consultar la API del hospital');
    } else {
      return this._normalizarFhir(JSON.parse(response.data));
    }
  }

  _normalizarFhir(fhirData) {
    const patient = this._extraerPaciente(fhirData);
    const condition = fhirData.entry?.find(e => e.resource?.resourceType === 'Condition')?.resource;
    const coverage = fhirData.entry?.find(e => e.resource?.resourceType === 'Coverage')?.resource;
    const { peso, talla, superficie_corporal } = this._extraerObservaciones(fhirData);
    const { calle, numero, pisoDepto } = this._extraerDireccion(patient?.address);

    const dni = patient?.identifier?.find(i => i.system === 'DNI');

    return {
      nombre: patient?.name?.[0]?.given?.[0] || null,
      apellido: patient?.name?.[0]?.family || null,
      tipo_documento: dni ? 'DNI' : null,
      numero_documento: dni?.value || null,
      fecha_nacimiento: patient?.birthDate || null,
      sexo: patient?.gender?.[0]?.toUpperCase() || null,
      nacionalidad: patient?.extension?.[0]?.valueCodeableConcept?.text || null,
      domicilio_calle: calle || null,
      domicilio_numero: numero || null,
      domicilio_piso_depto: pisoDepto || null,
      codigo_postal: patient?.address?.[0]?.postalCode || null,
      localidad: patient?.address?.[0]?.city || null,
      partido: patient?.address?.[0]?.district || null,
      telefono: patient?.telecom?.find(t => t.system === 'phone')?.value || null,
      email: patient?.telecom?.find(t => t.system === 'email')?.value || null,
      peso,
      talla,
      superficie_corporal,
      diagnostico: condition?.code?.text || null,
      obra_social: coverage?.payor?.[0]?.display || null,
    };
  }

  _extraerPaciente(fhirData) {
    const entry = fhirData.entry?.find(e => e.resourceType === 'Patient' || e.resource?.resourceType === 'Patient');
    return entry?.resource || entry || null;
  }

  _extraerObservaciones(fhirData) {
    const observations = fhirData.entry
      ?.filter(e => e.resource?.resourceType === 'Observation')
      .map(e => e.resource) || [];

    return {
      peso: observations.find(o => o.id === 'obs-weight')?.valueQuantity?.value || null,
      talla: observations.find(o => o.id === 'obs-height')?.valueQuantity?.value || null,
      superficie_corporal: observations.find(o => o.id === 'obs-bsa')?.valueQuantity?.value || null
    };
  }

  _extraerDireccion(address) {
    if (!address?.[0]?.line) return { calle: null, numero: null, pisoDepto: null };

    // Si line es array, unirlo
    const lineStr = Array.isArray(address[0].line) ? address[0].line.join(', ') : address[0].line;
    const [calleRaw, numero, pisoRaw] = lineStr.split(',').map(s => s.trim());

    const calle = calleRaw?.replace(/Piso\s*\d+[A-Z]?/i, '').trim() || calleRaw;
    const pisoDepto = pisoRaw?.match(/(\d+[A-Z]?)/i)?.[1] || pisoRaw || null;

    return { calle, numero, pisoDepto };
  }
}


const apiHospitalConector = new ApiHospitalConector();
export default apiHospitalConector;
