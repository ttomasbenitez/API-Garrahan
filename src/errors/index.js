export const ERROR_CAMPOS_REQUERIDOS = 'Faltan campos requeridos';
// ===== Constantes =====
export const STATUS_BAD_REQUEST = 400;
export const ERROR_CODE_VALIDATION = 'VALIDATION_ERROR';

export const UCUM_ALLOWED = Object.freeze(['mg','g','mg/m2','mg/kg','IU','mg/mL']);
export const REGEX_FRECUENCIA = /^\d+(,\d+)*$/; // "1,2,5"

// Mensajes simples (sin path)
export const MSG_ARRAY_REQUIRED = 'Debe enviar un array con al menos 1 administración';
export const MSG_REQ = (f) => `${f} es requerido`;
export const MSG_INT_POS = (f) => `${f} debe ser un entero > 0`;
export const MSG_NUM_POS = (f) => `${f} debe ser > 0`;
export const MSG_INT_MIN0 = (f) => `${f} debe ser un entero ≥ 0`;
export const MSG_UNIDAD = (permitidas) => `dosis_unidad inválida (permitidas: ${permitidas})`;
export const MSG_FRECUENCIA = 'frecuencia debe ser una lista de días separada por coma, ej: "1,2,5"';

// Normalización de unidades (alias → forma canónica)
export const UNIT_NORMALIZATION_MAP = Object.freeze({
  'mg/ml': 'mg/mL',
  'iu': 'IU',
  'mg': 'mg',
  'g': 'g',
});

// Re-exportar errores específicos de módulos
export * from './paciente.js';
export * from './profesional.js';
export * from './droga.js';
export * from './protocolo.js';
export * from './pacienteProfesional.js';
