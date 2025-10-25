
// utils/oracleFkMapper.js
import { FK_NOT_EXISTENT_CODE } from '../errors/index.js';
import {
  ERROR_RECETA_PACIENTE_INEXISTENTE,
  ERROR_RECETA_PROFESIONAL_INEXISTENTE,
  ERROR_RECETA_CICLO_INEXISTENTE,
  ERROR_FK_RECETA_PACIENTE,
  ERROR_FK_RECETA_PROFESIONAL,
  ERROR_FK_RECETA_CICLO,
} from '../errors/receta.js';

export function mapRecetaPacienteInsertError(err) {
  if (!err || err.errorNum !== FK_NOT_EXISTENT_CODE) return null;

  const msg = (err.message || '').toUpperCase();

  if (msg.includes('FK_RECETA_PACIENTE')) {
    const e = new Error(ERROR_RECETA_PACIENTE_INEXISTENTE);
    e.status = 404; e.code = ERROR_FK_RECETA_PACIENTE; e.message = ERROR_RECETA_PACIENTE_INEXISTENTE;
    return e;
  }
  if (msg.includes('FK_RECETA_PROFESIONAL')) {
    const e = new Error(ERROR_RECETA_PROFESIONAL_INEXISTENTE);
    e.status = 404; e.code = ERROR_FK_RECETA_PROFESIONAL; e.message = ERROR_RECETA_PROFESIONAL_INEXISTENTE;
    return e;
  }
  if (msg.includes('FK_RECETA_CICLO')) {
    const e = new Error(ERROR_RECETA_CICLO_INEXISTENTE);
    e.status = 404; e.code = ERROR_FK_RECETA_CICLO; e.message = ERROR_RECETA_CICLO_INEXISTENTE;
    return e;
  }

  return null;
}
