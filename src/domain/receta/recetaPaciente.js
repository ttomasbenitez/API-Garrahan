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
    if (this.protocolo_id  === null || this.ciclo_id  === null || this.regimen  === null) {
      throw new Error('protocolo_id, ciclo_id y regimen son obligatorios.');
    }
    if (this.paciente_id  === null) {
      throw new Error('paciente_id es obligatorio.');
    }
    if (this.profesional_id  === null) {
      throw new Error('profesional_id es obligatorio.');
    }

    if (this.estado && this.estado.length > 100) {
      throw new Error('estado no puede superar 100 caracteres.');
    }

    if (this.peso === null || this.talla === null || this.superficie_corporal === null) {
      throw new Error('peso, talla y superficie_corporal son obligatorios.');
    }

    if (this.peso <= 0) {
      throw new Error('peso debe ser mayor que 0.');
    }
    if (this.talla <= 0) {
      throw new Error('talla debe ser mayor que 0.');
    }
    if (this.superficie_corporal <= 0) {
      throw new Error('superficie_corporal debe ser mayor que 0.');
    }
  }
}

export default RecetaPaciente;
