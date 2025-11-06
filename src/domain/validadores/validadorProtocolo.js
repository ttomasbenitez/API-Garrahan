import { MSG_REQ } from '../../errors/index.js';
import Validador from './validador.js';

class ValidadorProtocolo extends Validador {

  validar(payload) {
    const errors = [];

    const nombre = this.limpiarEspacios(payload?.nombre);
    const enfermedad = this.limpiarEspacios(payload?.enfermedad);
    const linea = this.limpiarEspacios(payload?.linea);
    const cantidad_regimenes = this.limpiarEspacios(payload?.cantidad_regimenes);

    if (!nombre) errors.push(MSG_REQ('nombre'));
    if (!enfermedad) errors.push(MSG_REQ('enfermedad'));
    if (!linea) errors.push(MSG_REQ('linea'));
    if (!cantidad_regimenes) errors.push(MSG_REQ('cantidad de regimenes'));
    if (errors.length) throw this.badRequest(errors);

    return { nombre, enfermedad, linea, cantidad_regimenes };
  }
}

export default ValidadorProtocolo;

