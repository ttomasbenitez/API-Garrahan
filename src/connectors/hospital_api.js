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
    const patient = fhirData.entry?.find(e => e.resourceType === 'Patient') || fhirData.entry?.[0];
    const condition = fhirData.entry?.find(e => e.resource?.resourceType === 'Condition')?.resource;
    const observations = fhirData.entry
      ?.filter(e => e.resource?.resourceType === 'Observation')
      .map(e => e.resource);

    const peso = observations?.find(o => o.id === 'obs-weight')?.valueQuantity?.value || null;
    const talla = observations?.find(o => o.id === 'obs-height')?.valueQuantity?.value || null;
    const superficie_corporal = observations?.find(o => o.id === 'obs-bsa')?.valueQuantity?.value || null;

    const dni = patient?.identifier?.find(i => i.system === 'DNI');

    return {
      nombre: patient?.name?.[0]?.given?.[0] || null,
      apellido: patient?.name?.[0]?.family || null,
      tipo_documento: dni ? 'DNI' : null,
      numero_documento: dni?.value || null,
      fecha_nacimiento: patient?.birthDate || null,
      sexo: patient?.gender?.[0]?.toUpperCase() || null,
      nacionalidad: patient?.extension?.[0]?.valueCodeableConcept?.text || null,
      domicilio_calle: patient?.address?.[0]?.line || null,
      domicilio_numero: patient?.address?.[0]?.number || null,
      domicilio_piso_depto: patient?.address?.[0]?.line?.split(',')?.[2]?.trim() || null,
      codigo_postal: patient?.address?.[0]?.postalCode || null,
      localidad: patient?.address?.[0]?.city || null,
      partido: patient?.address?.[0]?.district || null,
      telefono: patient?.telecom?.find(t => t.system === 'phone')?.value || null,
      email: patient?.telecom?.find(t => t.system === 'email')?.value || null,
      peso,
      talla,
      superficie_corporal,
      diagnostico: condition?.code?.text || null,
    };
  }
}


const apiHospitalConector = new ApiHospitalConector();
export default apiHospitalConector;
