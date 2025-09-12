import { ERROR_CODE_VALIDATION, STATUS_BAD_REQUEST } from '../../errors/index.js';

class Validador {

  badRequest(payload) {
    const err = new Error('VALIDATION_ERROR');
    err.status = STATUS_BAD_REQUEST;
    err.code = ERROR_CODE_VALIDATION;
    err.details = payload;
    return err;
  }

  limpiarEspacios(s) {
    if (s === null) return '';
    return String(s).trim().replace(/\s+/g, ' ');
  }

}

export default Validador;
