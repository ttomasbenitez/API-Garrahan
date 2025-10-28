import { ERROR_RECETA_PACIENTE_CREACION_CODE } from '../../errors/receta.js';
import { getError, toNum, toStr } from '../../utils/formatters.js';
import { ContextoSnapshot, Contacto, DatosPaciente, Domicilio, Identidad, PacienteSnapshot } from './pacienteSnapshot.js';

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

    this.validar();
  }

  static fromBody(body) {
    const identidad = new Identidad({
      nombre: body.nombre, apellido: body.apellido,
      tipoDocumento: body.tipo_documento, numeroDocumento: body.numero_documento,
      fechaNacimiento: body.fecha_nacimiento ? new Date(body.fecha_nacimiento) : null,
      sexo: body.sexo, nacionalidad: body.nacionalidad
    });
    const domicilio = new Domicilio({
      calle: body.domicilio_calle, numero: body.domicilio_numero, piso: body.domicilio_piso,
      depto: body.domicilio_depto, codigoPostal: body.codigo_postal,
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
      peso: body.peso, talla: body.talla, superficieCorporal: body.superficie_corporal
    });

    const contexto = new ContextoSnapshot({
      protocolo_id: body.protocolo_id, ciclo_id: body.ciclo_id, regimen: body.regimen, numeroCiclo: body.numero_ciclo
    });

    return new RecetaPaciente({
      paciente_snapshot,
      datos_paciente,
      diagnostico: body.diagnostico,
      contexto,
      paciente_id: body.paciente_id,
      profesional_id: body.profesional_id,
      estado: body.estado,
      fecha_prescripcion: body.fecha_prescripcion ?? null,
      detalles: body.detalles ?? []
    });
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

    if (this.estado && this.estado.length > 100) {
      throw getError('estado no puede superar 100 caracteres.', ERROR_RECETA_PACIENTE_CREACION_CODE);
    }
  }

}

export default RecetaPaciente;
