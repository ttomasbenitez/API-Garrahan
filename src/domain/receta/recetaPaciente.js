import { ERROR_RECETA_PACIENTE_CREACION_CODE } from '../../errors/receta.js';
import { getError, toNum, toStr } from '../../utils/formatters.js';
import { ContextoSnapshot, Contacto, DatosPaciente, Domicilio, Identidad, PacienteSnapshot } from './pacienteSnapshot.js';
import { RecetaDetalle } from './recetaDetalle.js';

class RecetaPaciente {
  constructor({
    paciente_snapshot,
    datos_paciente,
    diagnostico,
    contexto,
    paciente_id,
    profesional_id,
    estado,
    fecha_prescripcion,
    detalles,
    tipo_receta,
    id,
  }) {

    this.paciente_snapshot = paciente_snapshot;
    this.datos_paciente = datos_paciente;
    this.diagnostico = diagnostico;
    this.contexto = contexto;
    this.paciente_id = toNum(paciente_id);
    this.profesional_id = toNum(profesional_id);
    this.estado = toStr(estado);
    this.fecha_prescripcion = fecha_prescripcion ?? new Date();
    this.detalles = detalles ?? [];
    this.tipo_receta = tipo_receta;
    this.id = id;

    this.validar();
  }

  static fromBody(body) {
    const identidad = new Identidad({
      nombre: body.nombre, apellido: body.apellido,
      tipo_documento: body.tipo_documento, numero_documento: body.numero_documento,
      fecha_nacimiento: body.fecha_nacimiento ? new Date(body.fecha_nacimiento) : null,
      sexo: body.sexo, nacionalidad: body.nacionalidad
    });
    const domicilio = new Domicilio({
      calle: body.domicilio_calle, numero: body.domicilio_numero, piso: body.domicilio_piso,
      depto: body.domicilio_depto, codigo_postal: body.codigo_postal,
      localidad: body.localidad, partido: body.partido
    });
    const contacto = new Contacto({
      telefono: body.telefono, email: body.email
    });
    const paciente_snapshot = new PacienteSnapshot({
      identidad,
      domicilio,
      contacto,
    });

    const datos_paciente = new DatosPaciente({
      peso: body.peso, talla: body.talla, superficie_corporal: body.superficie_corporal
    });

    const contexto = new ContextoSnapshot({
      protocolo_id: body.protocolo_id, ciclo_id: body.ciclo_id, regimen: body.regimen, numero_ciclo: body.numero_ciclo
    });

    const detalles = body.detalles ? body.detalles.map((d) =>
      new RecetaDetalle({admin_id: d.admin_id, nombre_generico: d.nombre_generico, presentacion: d.presentacion,
        concentracion: d.concentracion, cantidad: d.cantidad, dosis_diaria: d.dosis_diaria, numero_dias: d.numero_dias,
        dosis_total: d.dosis_total, via_administracion: d.via_administracion, receta_id: body.id ?? null})) : [];

    return new RecetaPaciente({
      paciente_snapshot,
      datos_paciente,
      diagnostico: body.diagnostico,
      contexto,
      paciente_id: body.paciente_id,
      profesional_id: body.profesional_id,
      estado: body.estado,
      tipo_receta: body.tipo_receta,
      fecha_prescripcion: body.fecha_prescripcion ?? null,
      detalles,
      id: body.id ?? null,
    });
  }

  nombre() {
    return this.paciente_snapshot.identidad.nombre;
  }

  apellido() {
    return this.paciente_snapshot.identidad.apellido;
  }

  nombreCompleto() {
    return `${this.paciente_snapshot.identidad.nombre} ${this.paciente_snapshot.identidad.apellido}`;
  }

  dni() {
    return this.paciente_snapshot.identidad.numero_documento;
  }

  domicilioCompleto() {
    const dom = this.paciente_snapshot.domicilio;
    const domicilio = `${dom.calle} ${dom.numero}, ${dom.localidad}`;

    if (dom.piso && dom.depto) {
      return `${domicilio}, Piso: ${dom.piso}, Depto: ${dom.depto}`;
    }

    return domicilio;
  }

  edad() {
    const hoy = new Date();
    const nacimiento = new Date(this.paciente_snapshot.identidad.fecha_nacimiento);

    let anos = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      anos--;
    }

    const ultimoCumpleanos = new Date(hoy.getFullYear(), nacimiento.getMonth(), nacimiento.getDate());
    if (hoy < ultimoCumpleanos) {
      ultimoCumpleanos.setFullYear(hoy.getFullYear() - 1);
    }
    const diferenciaEnMilisegundos = hoy - ultimoCumpleanos;
    const dias = Math.floor(diferenciaEnMilisegundos / (1000 * 60 * 60 * 24));

    return `${anos} años y ${dias} días`;
  }


  validar() {
    this.paciente_snapshot.validar();
    this.datos_paciente.validar();
    this.contexto.validar();

    if (this.paciente_id === null) {
      throw getError('paciente_id es obligatorio.', ERROR_RECETA_PACIENTE_CREACION_CODE);
    }
    if (this.profesional_id === null) {
      throw getError('profesional_id es obligatorio.', ERROR_RECETA_PACIENTE_CREACION_CODE);
    }
    if (this.tipo_receta === null) {
      throw getError('tipo_receta es obligatorio.', ERROR_RECETA_PACIENTE_CREACION_CODE);
    }
    if (this.estado && this.estado.length > 100) {
      throw getError('estado no puede superar 100 caracteres.', ERROR_RECETA_PACIENTE_CREACION_CODE);
    }
  }

}

export default RecetaPaciente;
