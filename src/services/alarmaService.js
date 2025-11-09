export class AlarmaService {
  constructor(alarmaRepo, configuracionAlarmaRepo, db) {
    this.alarmaRepo = alarmaRepo;
    this.configuracionAlarmaRepo = configuracionAlarmaRepo;
    this.db = db;
  }

  /**
   * Lista todas las alarmas activas
   */
  async listar() {
    return this.alarmaRepo.listar();
  }

  /**
   * Lista alarmas por profesional
   */
  async listarPorProfesional(profesionalId) {
    return this.alarmaRepo.listarPorProfesional(profesionalId);
  }

  async generarAlarmas() {
    try {
      // 1. Obtener configuración (límite de días)
      const configuracion = await this.configuracionAlarmaRepo.obtener();
      const limiteDias = configuracion.limite_dias;

      // 2. Obtener pacientes con protocolo activo
      const pacientesActivosQuery = `
        SELECT DISTINCT paciente_id
        FROM protocolo_paciente
        WHERE estado = 'Activo'
      `;
      const resultPacientes = await this.db.execute(pacientesActivosQuery);

      if (resultPacientes.rows.length === 0) {
        // No hay pacientes activos, limpiamos alarmas y actualizamos última ejecución
        await this.alarmaRepo.limpiar();
        await this.configuracionAlarmaRepo.actualizarUltimaEjecucion();
        return { alarmasGeneradas: 0, pacientesActivos: 0 };
      }

      const pacienteIds = resultPacientes.rows.map(row => row.PACIENTE_ID);

      // 3. Obtener la última receta de cada paciente
      const ultimasRecetasQuery = `
        SELECT 
          rp.paciente_id,
          MAX(rp.fecha_prescripcion) as fecha_ultima_receta
        FROM receta_paciente rp
        WHERE rp.paciente_id IN (${pacienteIds.join(',')})
        GROUP BY rp.paciente_id
      `;
      const resultRecetas = await this.db.execute(ultimasRecetasQuery);

      // 4. Calcular días transcurridos y generar alarmas
      const alarmasAGenerar = [];
      const fechaActual = new Date();

      for (const row of resultRecetas.rows) {
        const fechaUltimaReceta = new Date(row.FECHA_ULTIMA_RECETA);
        const diasTranscurridos = Math.floor(
          (fechaActual - fechaUltimaReceta) / (1000 * 60 * 60 * 24)
        );

        // Si superó el límite, generar alarma
        if (diasTranscurridos > limiteDias) {
          alarmasAGenerar.push({
            paciente_id: row.PACIENTE_ID,
            fecha_ultima_receta: fechaUltimaReceta,
            dias_transcurridos: diasTranscurridos
          });
        }
      }

      // 5. Limpiar alarmas existentes y guardar nuevas
      await this.alarmaRepo.limpiar();

      let alarmasInsertadas = 0;
      if (alarmasAGenerar.length > 0) {
        alarmasInsertadas = await this.alarmaRepo.guardarLote(alarmasAGenerar);
      }

      // 6. Actualizar última ejecución del job
      await this.configuracionAlarmaRepo.actualizarUltimaEjecucion();

      return {
        alarmasGeneradas: alarmasInsertadas,
        pacientesActivos: pacienteIds.length,
        pacientesConAlarma: alarmasAGenerar.length
      };
    } catch (error) {
      console.error('Error al generar alarmas:', error);
      throw error;
    }
  }
}
