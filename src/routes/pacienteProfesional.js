import express from 'express';

export default function buildPacienteProfesionalRouter(controller) {
  const r = express.Router();

  // Gestión de colaboradores
  r.post('/agregar-colaborador', controller.agregarColaborador);
  r.delete('/profesionales/:profesional_id/pacientes/:paciente_id', controller.removerColaborador);

  // Cambio de profesional principal
  r.put('/pacientes/:paciente_id/profesional-principal', controller.cambiarPrincipal);

  // Consultas
  r.get('/pacientes/:paciente_id/equipo', controller.obtenerEquipo);
  r.get('/profesionales/:profesional_id/pacientes', controller.obtenerPacientes);

  return r;
}
