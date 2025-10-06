import express from 'express';

export default function buildPacienteProfesionalRouter(controller) {
  const r = express.Router();
  
  // Gestión de colaboradores
  r.post('/agregar-colaborador', controller.agregarColaborador);
  r.delete('/profesional/:profesional_id/paciente/:paciente_id', controller.removerColaborador);
  
  // Cambio de profesional principal
  r.put('/paciente/:paciente_id/profesional-principal', controller.cambiarPrincipal);
  
  // Consultas
  r.get('/paciente/:paciente_id/equipo', controller.obtenerEquipo);
  r.get('/profesional/:profesional_id/pacientes', controller.obtenerPacientes);
  
  return r;
}