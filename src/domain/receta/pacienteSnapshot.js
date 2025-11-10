import { getError, toFloat, toNum } from '../../utils/formatters.js';
import { ERROR_RECETA_PACIENTE_CREACION_CODE } from '../../errors/receta.js';


export class Domicilio {
  constructor({ calle, numero, piso, depto, codigo_postal, localidad, partido }) {
    this.calle = calle ?? null;
    this.numero = numero ?? null;
    this.piso = piso ?? null;
    this.depto = depto ?? null;
    this.codigo_postal = codigo_postal ?? null;
    this.localidad = localidad ?? null;
    this.partido = partido ?? null;
  }

  validar() {
    if (!this.calle) throw getError('calle es requerida', 'DOMICILIO_CALLE_REQUERIDA');
    if (!this.numero) throw getError('numero es requerido', 'DOMICILIO_NUMERO_REQUERIDO');
    if (!this.codigo_postal) throw getError('codigo_postal es requerido', 'DOMICILIO_CODIGO_POSTAL_REQUERIDO');
    if (!this.localidad) throw getError('localidad es requerida', 'DOMICILIO_LOCALIDAD_REQUERIDA');
  }
}

export class Contacto {
  constructor({ telefono, email }) {
    this.telefono = telefono ?? null;
    this.email = email ?? null;
  }
}

export class Identidad {
  constructor({ nombre, apellido, tipo_documento, numero_documento, fecha_nacimiento, sexo, nacionalidad }) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.tipo_documento = tipo_documento;
    this.numero_documento = numero_documento;
    this.fecha_nacimiento = fecha_nacimiento;
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
  }
}

export class DatosPaciente {
  constructor({ peso, talla, superficie_corporal }) {
    this.peso = toFloat(peso);
    this.talla = toFloat(talla);
    this.superficie_corporal = toFloat(superficie_corporal);
  }

  validar() {
    if (!this.peso || !this.talla || !this.superficie_corporal) {
      throw getError('peso, talla y superficie_corporal son requeridos', ERROR_RECETA_PACIENTE_CREACION_CODE);
    }
    if (this.peso !== null && this.peso <= 0) {
      throw getError('peso inválido', 'RECETA_PESO_INVALIDO');
    }
    if (this.talla !== null && this.talla <= 0) {
      throw getError('talla inválida', 'RECETA_TALLA_INVALIDA');
    }
    if (this.superficie_corporal !== null && this.superficie_corporal <= 0) {
      throw getError('superficie corporal inválida', 'RECETA_SUPERFICIE_CORPORAL_INVALIDA');
    }
  }
}

export class ContextoSnapshot {
  constructor({ protocolo_id, ciclo_id, regimen }) {
    this.protocolo_id = toNum(protocolo_id);
    this.ciclo_id = toNum(ciclo_id);
    this.regimen = toNum(regimen);
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
