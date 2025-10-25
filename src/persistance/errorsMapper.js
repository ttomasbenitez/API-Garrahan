
// utils/oracleFkMapper.js
import { FK_NOT_EXISTENT_CODE } from '../errors/index.js';
import {
  ERROR_RECETA_PACIENTE_INEXISTENTE,
  ERROR_RECETA_PROFESIONAL_INEXISTENTE,
  ERROR_RECETA_CICLO_INEXISTENTE,
} from '../errors/receta.js';

export function mapRecetaPacienteInsertError(err) {
  if (!err || err.errorNum !== FK_NOT_EXISTENT_CODE) return null;

  const msg = (err.message || '').toUpperCase();

  if (msg.includes('FK_RECETA_PACIENTE')) {
    const e = new Error(ERROR_RECETA_PACIENTE_INEXISTENTE);
    e.statusCode = 404; e.code = 'FK_PACIENTE';
    return e;
  }
  if (msg.includes('FK_RECETA_PROFESIONAL')) {
    const e = new Error(ERROR_RECETA_PROFESIONAL_INEXISTENTE);
    e.statusCode = 404; e.code = 'FK_PROFESIONAL';
    return e;
  }
  if (msg.includes('FK_RECETA_CICLO')) {
    const e = new Error(ERROR_RECETA_CICLO_INEXISTENTE);
    e.statusCode = 404; e.code = 'FK_CICLO';
    return e;
  }

  return null;
}
