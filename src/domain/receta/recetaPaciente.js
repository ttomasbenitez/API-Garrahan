import { ERROR_RECETA_PACIENTE_CREACION_CODE } from '../../errors/receta.js';
import { toFloat, toNum, toStr } from '../../utils/formatters.js';

class RecetaPaciente {
  constructor(protocolo_id, ciclo_id, regimen, paciente_id, profesional_id, estado, peso, talla, superficie_corporal, fecha_receta, receta_id) {
    this.protocolo_id = toNum(protocolo_id);
    this.ciclo_id = toNum(ciclo_id);
    this.regimen = toNum(regimen);

    this.paciente_id = toNum(paciente_id);
    this.profesional_id = toNum(profesional_id);
    this.fecha_receta = fecha_receta;

    this.estado = toStr(estado);

    this.peso = toFloat(peso);
    this.talla = toFloat(talla);
    this.superficie_corporal = toFloat(superficie_corporal);

    this.id = receta_id ?? null;

    this.validar();
  }

  validar() {
    const error = (message, code) => {
      const err = new Error(message);
      err.status = 404;
      err.code = code;
      return err;
    };

    if (this.protocolo_id === null || this.ciclo_id === null || this.regimen === null) {
      throw error('protocolo_id, ciclo_id y regimen son obligatorios.', ERROR_RECETA_PACIENTE_CREACION_CODE);
    }

    if (this.paciente_id === null) {
      throw error('paciente_id es obligatorio.', ERROR_RECETA_PACIENTE_CREACION_CODE);
    }

    if (this.profesional_id === null) {
      throw error('profesional_id es obligatorio.', ERROR_RECETA_PACIENTE_CREACION_CODE);
    }

    if (this.estado && this.estado.length > 100) {
      throw error('estado no puede superar 100 caracteres.', ERROR_RECETA_PACIENTE_CREACION_CODE);
    }

    if (this.peso === null || this.talla === null || this.superficie_corporal === null) {
      throw error('peso, talla y superficie_corporal son obligatorios.', ERROR_RECETA_PACIENTE_CREACION_CODE);
    }

    if (this.peso <= 0) {
      throw error('peso debe ser mayor que 0.', ERROR_RECETA_PACIENTE_CREACION_CODE);
    }

    if (this.talla <= 0) {
      throw error('talla debe ser mayor que 0.', ERROR_RECETA_PACIENTE_CREACION_CODE);
    }

    if (this.superficie_corporal <= 0) {
      throw error('superficie_corporal debe ser mayor que 0.', ERROR_RECETA_PACIENTE_CREACION_CODE);
    }
  }

}

export default RecetaPaciente;
