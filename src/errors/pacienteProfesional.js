// ===== Errores específicos para Gestión de Equipo Tratante =====

// Códigos de estado HTTP
export const STATUS_NOT_FOUND = 404;
export const STATUS_BAD_REQUEST = 400;
export const STATUS_CONFLICT = 409;
export const STATUS_INTERNAL_ERROR = 500;

// Mensajes de error - Profesional
export const ERROR_PROFESIONAL_NO_ENCONTRADO = 'Profesional no encontrado';
export const ERROR_PROFESIONAL_YA_ASIGNADO = 'El profesional ya está asignado a este paciente';
export const ERROR_PROFESIONAL_ES_PRINCIPAL = 'No se puede agregar como consultor al profesional principal';
export const ERROR_PROFESIONAL_MISMO_ROL = 'El profesional ya tiene este rol asignado';

// Mensajes de error - Paciente
export const ERROR_PACIENTE_NO_ENCONTRADO = 'Paciente no encontrado';
export const ERROR_PACIENTE_SIN_PROFESIONAL = 'El paciente no tiene profesional principal asignado';
export const ERROR_PACIENTE_CAMPOS_REQUERIDOS = 'Faltan campos requeridos para el paciente';

// Mensajes de error - Relación Paciente-Profesional
export const ERROR_RELACION_NO_ENCONTRADA = 'Relación paciente-profesional no encontrada';
export const ERROR_CAMBIO_PROFESIONAL_PRINCIPAL = 'Error al cambiar el profesional principal';
export const ERROR_AGREGAR_COLABORADOR = 'Error al agregar profesional colaborador';
export const ERROR_REMOVER_COLABORADOR = 'Error al remover profesional colaborador';

// Mensajes de error - Validaciones
export const ERROR_ID_PACIENTE_REQUERIDO = 'El ID del paciente es requerido';
export const ERROR_ID_PROFESIONAL_REQUERIDO = 'El ID del profesional es requerido';
export const ERROR_ROL_INVALIDO = 'El rol especificado no es válido';
export const ERROR_DATOS_INVALIDOS = 'Los datos proporcionados no son válidos';

// Mensajes de error - Base de datos
export const ERROR_DB_CONEXION = 'Error de conexión a la base de datos';
export const ERROR_DB_TRANSACCION = 'Error en la transacción de base de datos';
export const ERROR_DB_CONSTRAINT = 'Violación de restricción de base de datos';

// Mensajes informativos
export const MSG_PROFESIONAL_AGREGADO = (profesionalId, pacienteId) =>
  `Profesional ${profesionalId} agregado como colaborador al paciente ${pacienteId}`;

export const MSG_PROFESIONAL_PRINCIPAL_CAMBIADO = (pacienteId, profesionalId) =>
  `Profesional principal del paciente ${pacienteId} cambiado a ${profesionalId}`;

export const MSG_COLABORADOR_REMOVIDO = (profesionalId, pacienteId) =>
  `Profesional ${profesionalId} removido como colaborador del paciente ${pacienteId}`;

export const MSG_EQUIPO_OBTENIDO = (pacienteId, cantidad) =>
  `Equipo tratante obtenido para paciente ${pacienteId}: ${cantidad} profesionales`;

export const MSG_PACIENTES_OBTENIDOS = (profesionalId, cantidad) =>
  `Pacientes obtenidos para profesional ${profesionalId}: ${cantidad} pacientes`;

// Roles válidos
export const ROLES_VALIDOS = Object.freeze(['Médico Tratante', 'Consultor']);
export const ROL_MEDICO_TRATANTE = 'Médico Tratante';
export const ROL_CONSULTOR = 'Consultor';

// Códigos de error específicos para logging
export const ERROR_CODES = Object.freeze({
  PROFESIONAL_NOT_FOUND: 'PP001',
  PROFESIONAL_ALREADY_ASSIGNED: 'PP002',
  PACIENTE_NOT_FOUND: 'PP003',
  INVALID_ROLE: 'PP004',
  DATABASE_ERROR: 'PP005',
  VALIDATION_ERROR: 'PP006',
  RELATIONSHIP_NOT_FOUND: 'PP007'
});
