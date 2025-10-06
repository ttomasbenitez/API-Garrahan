import oracledb from 'oracledb';
import Paciente from '../domain/paciente.js';
import { ERROR_PACIENTE_CREACION, ERROR_PACIENTE_NO_ENCONTRADO } from '../errors/paciente.js';
import { RepositorioPacienteProfesional } from './repositorioPacienteProfesional.js';

export class RepositorioPaciente {
  constructor(connection) {
    this.connection = connection;
    this.pacienteProfesionalRepo = new RepositorioPacienteProfesional(connection);
  }

  async guardar(paciente) {
    // Crear el paciente primero
    const result = await this.connection.execute(
      `INSERT INTO paciente (
            nombre, apellido, id_hospitalario, fecha_nacimiento, peso, sexo, profesional_id, ultima_modificacion, obra_social
          ) VALUES (
            :nombre, :apellido, :id_hospitalario, :fecha_nacimiento, :peso, :sexo, :profesional_id, :ultima_modificacion, :obra_social
          )
          RETURNING id INTO :id`,
      {
        nombre: paciente.nombre,
        apellido: paciente.apellido,
        id_hospitalario: paciente.id_hospitalario,
        fecha_nacimiento: paciente.fecha_nacimiento,
        peso: paciente.peso,
        sexo: paciente.sexo,
        profesional_id: paciente.profesional_id,
        ultima_modificacion: paciente.ultima_modificacion,
        obra_social: paciente.obra_social,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      throw new Error(ERROR_PACIENTE_CREACION);
    }

    const pacienteId = result.outBinds.id[0];

    try {
      // Asignar automáticamente al profesional que lo crea
      await this.connection.execute(
        `INSERT INTO paciente_profesional (profesional_id, paciente_id, rol)
         VALUES (:profesional_id, :paciente_id, :rol)`,
        {
          profesional_id: paciente.profesional_id,
          paciente_id: pacienteId,
          rol: 'Médico Tratante'
        },
        { autoCommit: true }
      );

      return pacienteId;
    } catch (error) {
      // Si falla la asignación profesional, loguear pero no fallar
      // porque el paciente ya fue creado exitosamente
      console.error('Error al asignar profesional automáticamente:', error.message);
      return pacienteId;
    }
  }

  async obtener(id) {
    const result = await this.connection.execute(
      `SELECT id, nombre, apellido, id_hospitalario, fecha_nacimiento, peso, sexo, profesional_id, ultima_modificacion, obra_social
           FROM paciente
           WHERE id = :id`,
      [id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0) {
      throw new Error(ERROR_PACIENTE_NO_ENCONTRADO);
    }

    const row = result.rows[0];
    return new Paciente(
      row.NOMBRE,
      row.APELLIDO,
      row.ID_HOSPITALARIO,
      row.FECHA_NACIMIENTO ? new Date(row.FECHA_NACIMIENTO).toISOString().split('T')[0] : null,
      row.PESO,
      row.SEXO,
      row.PROFESIONAL_ID,
      row.ID,
      row.ULTIMA_MODIFICACION,
      row.OBRA_SOCIAL
    );
  }

  async cambiarProfesionalPrincipal(paciente_id, nuevo_profesional_id) {
    try {
      // 1. Actualizar el profesional_id en la tabla paciente
      const updateResult = await this.connection.execute(
        `UPDATE paciente SET profesional_id = :nuevo_profesional_id WHERE id = :paciente_id`,
        {
          nuevo_profesional_id,
          paciente_id
        },
        { autoCommit: true }
      );

      if (updateResult.rowsAffected === 0) {
        throw new Error('Paciente no encontrado');
      }

      // 2. Eliminar SOLO el médico tratante anterior (no los consultores)
      await this.connection.execute(
        `DELETE FROM paciente_profesional 
         WHERE paciente_id = :paciente_id AND rol = 'Médico Tratante'`,
        { paciente_id },
        { autoCommit: true }
      );

      // 3. Verificar si el nuevo profesional ya está como consultor
      const existeComoConsultor = await this.connection.execute(
        `SELECT COUNT(*) as count FROM paciente_profesional 
         WHERE profesional_id = :profesional_id AND paciente_id = :paciente_id`,
        {
          profesional_id: nuevo_profesional_id,
          paciente_id
        },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      // 4. Si no está como consultor, agregarlo como Médico Tratante
      // Si ya está como consultor, actualizarlo a Médico Tratante
      if (existeComoConsultor.rows[0].COUNT > 0) {
        // Ya existe, actualizar rol a Médico Tratante
        await this.connection.execute(
          `UPDATE paciente_profesional 
           SET rol = 'Médico Tratante'
           WHERE profesional_id = :profesional_id AND paciente_id = :paciente_id`,
          {
            profesional_id: nuevo_profesional_id,
            paciente_id
          },
          { autoCommit: true }
        );
      } else {
        // No existe, crear nueva asignación como Médico Tratante
        await this.connection.execute(
          `INSERT INTO paciente_profesional (profesional_id, paciente_id, rol)
           VALUES (:profesional_id, :paciente_id, :rol)`,
          {
            profesional_id: nuevo_profesional_id,
            paciente_id,
            rol: 'Médico Tratante'
          },
          { autoCommit: true }
        );
      }

      return true;
    } catch (error) {
      throw error;
    }
  }
}
