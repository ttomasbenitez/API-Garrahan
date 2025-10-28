import { getError, toFloat, toNum } from '../../utils/formatters.js';


export class Domicilio {
  constructor({ calle, numero, piso, depto, codigoPostal, localidad, partido }) {
    this.calle = calle ?? null;
    this.numero = numero ?? null;
    this.piso = piso ?? null;
    this.depto = depto ?? null;
    this.codigoPostal = codigoPostal ?? null;
    this.localidad = localidad ?? null;
    this.partido = partido ?? null;
  }

  validar() {
    if (!this.calle) throw getError('calle es requerida', 'DOMICILIO_CALLE_REQUERIDA');
    if (!this.numero) throw getError('numero es requerido', 'DOMICILIO_NUMERO_REQUERIDO');
    if (!this.piso) throw getError('piso es requerido', 'DOMICILIO_PISO_REQUERIDO');
    if (!this.depto) throw getError('depto es requerido', 'DOMICILIO_DEPTO_REQUERIDO');
    if (!this.codigoPostal) throw getError('codigoPostal es requerido', 'DOMICILIO_CODIGO_POSTAL_REQUERIDO');
    if (!this.localidad) throw getError('localidad es requerida', 'DOMICILIO_LOCALIDAD_REQUERIDA');
    if (!this.partido) throw getError('partido es requerido', 'DOMICILIO_PARTIDO_REQUERIDO');
  }
}

export class Contacto {
  constructor({ telefono, email }) {
    this.telefono = telefono ?? null;
    this.email = email ?? null;
  }

  validar() {
    if (!this.telefono) throw getError('telefono es requerido', 'CONTACTO_TELEFONO_REQUERIDO');
    if (!this.email) throw getError('email es requerido', 'CONTACTO_EMAIL_REQUERIDO');
  }
}

export class Identidad {
  constructor({ nombre, apellido, tipoDocumento, numeroDocumento, fechaNacimiento, sexo, nacionalidad }) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.tipoDocumento = tipoDocumento;
    this.numeroDocumento = numeroDocumento;
    this.fechaNacimiento = fechaNacimiento;
    this.sexo = sexo;
    this.nacionalidad = nacionalidad;

    this.validar();
  }

  validar() {
    if (!this.nombre) {
      throw getError('nombre es requerido', 'RECETA_NOMBRE_REQUERIDO');
    }
    if (!this.apellido) {
      throw getError('apellido es requerido', 'RECETA_APELLIDO_REQUERIDO');
    }

    if (this.sexo && !['M','F'].includes(this.sexo)) {
      throw getError('sexo inválido', 'RECETA_SEXO_INVALIDO');
    }

    if (this.fechaNacimiento && isNaN(this.fechaNacimiento.getTime())) {
      throw getError('fecha de nacimiento inválida', 'RECETA_FECHA_NACIMIENTO_INVALIDA');
    }

    if (!this.nacionalidad) {
      throw getError('nacionalidad inválida', 'RECETA_NACIONALIDAD_INVALIDA');
    }

  }
}

export class DatosPaciente {
  constructor({ peso, talla, superficieCorporal }) {
    this.peso = toFloat(peso);
    this.talla = toFloat(talla);
    this.superficieCorporal = toFloat(superficieCorporal);
  }

  validar() {
    if (!this.peso || !this.talla || !this.superficieCorporal) {
      throw getError('peso, talla y superficie_corporal son requeridos', 'RECETA_DATOS_PACIENTE_REQUERIDOS');
    }
    if (this.peso !== null && this.peso <= 0) {
      throw getError('peso inválido', 'RECETA_PESO_INVALIDO');
    }
    if (this.talla !== null && this.talla <= 0) {
      throw getError('talla inválida', 'RECETA_TALLA_INVALIDA');
    }
    if (this.superficieCorporal !== null && this.superficieCorporal <= 0) {
      throw getError('superficie corporal inválida', 'RECETA_SUPERFICIE_CORPORAL_INVALIDA');
    }
  }
}

export class ContextoSnapshot {
  constructor({ protocolo_id, ciclo_id, regimen, numeroCiclo }) {
    this.protocolo_id = toNum(protocolo_id);
    this.ciclo_id = toNum(ciclo_id);
    this.regimen = toNum(regimen);
    this.numeroCiclo = toNum(numeroCiclo);
  }

  validar() {
    if (this.protocolo_id === null) {
      throw getError('protocolo_id es obligatorio', 'RECETA_PROTOCOLO_ID_REQUERIDO');
    }
    if (this.ciclo_id === null) {
      throw getError('ciclo_id es obligatorio', 'RECETA_CICLO_ID_REQUERIDO');
    }
    if (this.regimen === null) {
      throw getError('regimen es obligatorio', 'RECETA_REGIMEN_REQUERIDO');
    }
    if (this.numeroCiclo === null) {
      throw getError('numero_ciclo es obligatorio', 'RECETA_NUMERO_CICLO_REQUERIDO');
    }
  }
}

export class PacienteSnapshot {
  constructor({ identidad, domicilio, contacto }) {
    this.identidad = identidad;
    this.domicilio = domicilio ?? new Domicilio({});
    this.contacto = contacto ?? new Contacto({});
  }

  validar() {
    if (!this.identidad?.nombre || !this.identidad?.apellido) {
      throw getError('nombre y apellido son obligatorios', 'RECETA_NOMBRE_APELLIDO_REQUERIDOS');
    }
    if (this.identidad?.sexo && !['M','F'].includes(this.identidad.sexo)) {
      throw getError('sexo inválido', 'RECETA_SEXO_INVALIDO');
    }
  }
}
