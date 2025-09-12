import { MSG_REQ } from '../../errors/index.js';
import Validador from './validador.js';

class ValidadorProtocolo extends Validador {

  validar(payload) {
    const errors = [];

    const nombre = this.limpiarEspacios(payload?.nombre);
    const enfermedad = this.limpiarEspacios(payload?.enfermedad);
    const linea = this.limpiarEspacios(payload?.linea);

    if (!nombre) errors.push(MSG_REQ('nombre'));
    if (!enfermedad) errors.push(MSG_REQ('enfermedad'));
    if (!linea) errors.push(MSG_REQ('linea'));
    if (errors.length) throw this.badRequest(errors);

    return { nombre, enfermedad, linea };
  }
}

export default ValidadorProtocolo;

