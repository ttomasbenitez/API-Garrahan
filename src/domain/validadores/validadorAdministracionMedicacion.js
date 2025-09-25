import { ERROR_CODE_VALIDATION, MSG_ARRAY_REQUIRED,
  MSG_FRECUENCIA, MSG_INT_MIN0, MSG_INT_POS, MSG_NUM_POS,
  MSG_REQ, MSG_UNIDAD, REGEX_FRECUENCIA, STATUS_BAD_REQUEST,
  UCUM_ALLOWED, UNIT_NORMALIZATION_MAP } from '../../errors/index.js';

class ValidadorAdministracionMedicacion {
  constructor() {
    this._ucumSet = new Set(UCUM_ALLOWED);
  }

  normalizarUnit(u) {
    if (u === null) return '';
    const raw = String(u).trim();
    const key = raw.toLowerCase();
    return UNIT_NORMALIZATION_MAP[key] || raw;
  }

  badRequest(payload) {
    const err = new Error('VALIDATION_ERROR');
    err.status = STATUS_BAD_REQUEST;
    err.code = ERROR_CODE_VALIDATION;
    err.details = payload;
    return err;
  }

  _validarItemAdministracionMedicacion(a, idx) {
    const errors = [];

    // droga_id
    if (!a.droga_id) {
      errors.push({ index: idx, field: 'droga_id', message: MSG_REQ('droga_id') });
    } else if (!Number.isInteger(a.droga_id) || a.droga_id <= 0) {
      errors.push({ index: idx, field: 'droga_id', message: MSG_INT_POS('droga_id') });
    }

    // dosis
    if (!a.dosis) errors.push({ index: idx, field: 'dosis', message: MSG_REQ('dosis') });
    else if (!(a.dosis > 0))
      errors.push({ index: idx, field: 'dosis', message: MSG_NUM_POS('dosis') });

    // dosis_unidad (normaliza)
    const unit = this.normalizarUnit(a?.dosis_unidad);
    if (!unit) errors.push({ index: idx, field: 'dosis_unidad', message: MSG_REQ('dosis_unidad') });
    else if (!this._ucumSet.has(unit))
      errors.push({ index: idx, field: 'dosis_unidad', message: MSG_UNIDAD(UCUM_ALLOWED.join(', ')) });
    else a.dosis_unidad = unit;

    // frecuencia
    const freq = a?.frecuencia;
    if (freq === null || String(freq).trim() === '')
      errors.push({ index: idx, field: 'frecuencia', message: MSG_REQ('frecuencia') });
    else if (!REGEX_FRECUENCIA.test(String(freq)))
      errors.push({ index: idx, field: 'frecuencia', message: MSG_FRECUENCIA });

    // administracion_diaria (0 válido)
    if (a?.administracion_diaria === null)
      errors.push({ index: idx, field: 'administracion_diaria', message: MSG_REQ('administracion_diaria') });
    else if (!Number.isInteger(a.administracion_diaria) || a.administracion_diaria < 0)
      errors.push({ index: idx, field: 'administracion_diaria', message: MSG_INT_MIN0('administracion_diaria') });

    // frecuencia_diaria (0 válido)
    if (a?.frecuencia_diaria === null)
      errors.push({ index: idx, field: 'frecuencia_diaria', message: MSG_REQ('frecuencia_diaria') });
    else if (!Number.isInteger(a.frecuencia_diaria) || a.frecuencia_diaria < 0)
      errors.push({ index: idx, field: 'frecuencia_diaria', message: MSG_INT_MIN0('frecuencia_diaria') });

    return errors;
  }

  validar(payload) {
    if (!Array.isArray(payload) || payload.length === 0) {
      throw this.badRequest([{ message: MSG_ARRAY_REQUIRED }]);
    }

    const allErrors = payload.flatMap((a, i) => this._validarItemAdministracionMedicacion(a, i));
    if (allErrors.length) throw this.badRequest(allErrors);

    for (const a of payload) {
      a.frecuencia_list = String(a.frecuencia).split(',').map(n => Number(n)).filter(Number.isFinite);
    }
    return payload;
  }
}

export default ValidadorAdministracionMedicacion;
