
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
import { getError } from '../utils/formatters.js';

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


export function mapRecetaDetalleInsertError(err) {
  const msg = (err.message || '').toUpperCase();
  if (msg.includes('FK_RD_ADMIN')) {
    return getError('No existe la administración de medicación indicada.', 'RECETA_DETALLE_ADMIN_INEXISTENTE');
  }
  if (msg.includes('FK_RD_RECETA')) {
    return getError('No existe la receta indicada.', 'RECETA_DETALLE_RECETA_INEXISTENTE');
  }
  if (msg.includes('PK_RECETA_DETALLE') || msg.includes('ORA-00001')) {
    return getError('Ya existe un detalle para ese (receta_id, admin_id).', 'RECETA_DETALLE_DUPLICADA');
  }
  const e = new Error('RECETA_DETALLE_CREACION_FALLO');
  e.status = 400; e.code = 'RECETA_DETALLE_CREACION_FALLO'; e.message = 'No se pudo crear el detalle de receta.';
  return e;
}
