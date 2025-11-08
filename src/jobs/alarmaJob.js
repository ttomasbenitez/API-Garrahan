import cron from 'node-cron';
import logger from '../utils/logger.js';

/**
 * Job que se ejecuta diariamente para generar alarmas de vencimiento de recetas
 * Se ejecuta todos los días a las 2:00 AM
 */
export const iniciarJobAlarmas = (alarmaService) => {
  const cronExpression = '* * * * *'; // lo dejo en modo testing para cada 1 minuto cronExpression = '0 2 * * *'; // lo dejo en modo producción para las 2 AM diarias

  const job = cron.schedule(cronExpression, async () => {
    logger.info('🔔 Iniciando job de generación de alarmas...');
    
    try {
      const resultado = await alarmaService.generarAlarmas();
      
      logger.info('✅ Job de alarmas completado exitosamente:', {
        alarmasGeneradas: resultado.alarmasGeneradas,
        pacientesActivos: resultado.pacientesActivos,
        pacientesConAlarma: resultado.pacientesConAlarma
      });
    } catch (error) {
      logger.error('❌ Error en job de alarmas:', error);
    }
  }, {
    scheduled: true,
    timezone: 'America/Argentina/Buenos_Aires'
  });

  logger.info(`📅 Job de alarmas programado para ejecutarse diariamente a las 2:00 AM (${cronExpression})`);

  return job;
};
