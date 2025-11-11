class Paciente {
  constructor({
    paciente_id = null,
    nombre = null,
    apellido = null,
    id_hospitalario = null,
    fecha_nacimiento = null,
    peso = null,
    sup_corporal = null,
    altura = null,
    ultima_modificacion = null,
    sexo = null,
    obra_social = null,
    tipo_documento = null,
    numero_documento = null,
    nacionalidad = null,
    domicilio_calle = null,
    domicilio_numero = null,
    domicilio_piso_depto = null,
    codigo_postal = null,
    localidad = null,
    partido = null,
    telefono = null,
    email = null,
    diagnostico = null
  } = {}) {
    this.paciente_id = paciente_id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.id_hospitalario = id_hospitalario;
    this.fecha_nacimiento = fecha_nacimiento;
    this.peso = peso;
    this.sup_corporal = sup_corporal;
    this.altura = altura;
    this.ultima_modificacion = ultima_modificacion;
    this.sexo = sexo;
    this.obra_social = obra_social;
    this.tipo_documento = tipo_documento;
    this.numero_documento = numero_documento;
    this.nacionalidad = nacionalidad;
    this.domicilio_calle = domicilio_calle;
    this.domicilio_numero = domicilio_numero;
    this.domicilio_piso_depto = domicilio_piso_depto;
    this.codigo_postal = codigo_postal;
    this.localidad = localidad;
    this.partido = partido;
    this.telefono = telefono;
    this.email = email;
    this.diagnostico = diagnostico;
  }
}

export default Paciente;
