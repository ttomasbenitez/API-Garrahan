import oracledb from 'oracledb';
import Paciente from '../domain/paciente.js';
import { ERROR_PACIENTE_NO_ASOCIADO } from '../errors/pacienteProfesional.js';

export class RepositorioPacienteProfesional {
  constructor(connection) {
    this.connection = connection;
  }

  async asignar(profesional_id, paciente_id, rol = 'Médico Tratante') {
    // 1. Verificar que el profesional existe
    const profesionalExiste = await this.connection.execute(
      'SELECT COUNT(*) as count FROM profesional WHERE profesional_id = :profesional_id',
      { profesional_id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (profesionalExiste.rows[0].COUNT === 0) {
      throw new Error('El profesional especificado no existe');
    }

    // 2. Verificar que el profesional no esté ya asignado a este paciente
    const yaAsignado = await this.connection.execute(
      `SELECT COUNT(*) as count FROM paciente_profesional 
       WHERE profesional_id = :profesional_id AND paciente_id = :paciente_id`,
      { profesional_id, paciente_id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (yaAsignado.rows[0].COUNT > 0) {
      throw new Error('El profesional ya está asignado a este paciente');
    }

    // 3. Crear la asignación
    const result = await this.connection.execute(
      `INSERT INTO paciente_profesional (profesional_id, paciente_id, rol)
       VALUES (:profesional_id, :paciente_id, :rol)`,
      {
        profesional_id,
        paciente_id,
        rol
      },
      { autoCommit: true }
    );
    return result.rowsAffected > 0;
  }

  async obtenerProfesionalesPorPaciente(paciente_id) {
    const result = await this.connection.execute(
      `SELECT pp.profesional_id, pp.paciente_id, pp.rol,
              p.nombre, p.apellido, p.especialidad, p.matricula
       FROM paciente_profesional pp
       JOIN profesional p ON pp.profesional_id = p.profesional_id  
       WHERE pp.paciente_id = :paciente_id
       ORDER BY pp.rol DESC, p.apellido, p.nombre`,
      [paciente_id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    return result.rows.map(row => ({
      profesional_id: row.PROFESIONAL_ID,
      paciente_id: row.PACIENTE_ID,
      rol: row.ROL,
      profesional: {
        nombre: row.NOMBRE,
        apellido: row.APELLIDO,
        especialidad: row.ESPECIALIDAD,
        matricula: row.MATRICULA
      }
    }));
  }

  async obtenerPacientesPorProfesional(profesional_id) {
    const result = await this.connection.execute(
      `SELECT pp.profesional_id, pp.paciente_id, pp.rol,
              pac.nombre, pac.apellido, pac.id_hospitalario, pac.sexo, pac.fecha_nacimiento
       FROM paciente_profesional pp
       JOIN paciente pac ON pp.paciente_id = pac.paciente_id  
       WHERE pp.profesional_id = :profesional_id
       ORDER BY pac.apellido, pac.nombre`,
      [profesional_id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    return result.rows.map(row => ({
      profesional_id: row.PROFESIONAL_ID,
      paciente_id: row.PACIENTE_ID,
      rol: row.ROL,
      paciente: {
        nombre: row.NOMBRE,
        apellido: row.APELLIDO,
        id_hospitalario: row.ID_HOSPITALARIO,
        sexo: row.SEXO,
        fecha_nacimiento: row.FECHA_NACIMIENTO
      }
    }));
  }

  async obtenerPacientePorProfesional(paciente_id, profesional_id) {
    const result = await this.connection.execute(
      `SELECT pp.profesional_id, pp.paciente_id, pp.rol,
              pac.nombre, pac.apellido, pac.id_hospitalario, pac.fecha_nacimiento, pac.peso,
              pac.ultima_modificacion, pac.sexo, pac.obra_social
       FROM paciente_profesional pp
       JOIN paciente pac ON pp.paciente_id = pac.paciente_id  
       WHERE pp.profesional_id = :profesional_id
         AND pp.paciente_id = :paciente_id`,
      [profesional_id, paciente_id],
    );

    if (result.rows.length === 0) {
      throw new Error(ERROR_PACIENTE_NO_ASOCIADO);
    }

    const row = result.rows[0];
    return new Paciente(
      row.NOMBRE,
      row.APELLIDO,
      row.ID_HOSPITALARIO,
      row.FECHA_NACIMIENTO ? new Date(row.FECHA_NACIMIENTO).toISOString().split('T')[0] : null,
      row.PESO,
      row.SEXO,
      row.OBRA_SOCIAL,
      row.ULTIMA_MODIFICACION,
      row.PACIENTE_ID
    );
  }

  async remover(profesional_id, paciente_id) {
    const result = await this.connection.execute(
      `DELETE FROM paciente_profesional 
       WHERE profesional_id = :profesional_id AND paciente_id = :paciente_id`,
      [profesional_id, paciente_id],
      { autoCommit: true }
    );
    return result.rowsAffected > 0;
  }

  async removerTodosProfesionalesDePaciente(paciente_id) {
    const result = await this.connection.execute(
      'DELETE FROM paciente_profesional WHERE paciente_id = :paciente_id',
      [paciente_id],
      { autoCommit: true }
    );
    return result.rowsAffected;
  }

  async existeAsignacion(profesional_id, paciente_id) {
    const result = await this.connection.execute(
      `SELECT COUNT(*) as count FROM paciente_profesional 
       WHERE profesional_id = :profesional_id AND paciente_id = :paciente_id`,
      [profesional_id, paciente_id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    return result.rows[0].COUNT > 0;
  }

  async cambiarProfesionalPrincipal(paciente_id, nuevo_profesional_id) {

    // 1. Eliminar SOLO el médico tratante anterior (no los consultores)
    await this.connection.execute(
      `DELETE FROM paciente_profesional 
       WHERE paciente_id = :paciente_id AND rol = 'Médico Tratante'`,
      { paciente_id },
      { autoCommit: true }
    );
    // 2. Verificar si el nuevo profesional ya está como consultor
    const existeComoConsultor = await this.connection.execute(
      `SELECT COUNT(*) as count FROM paciente_profesional 
       WHERE profesional_id = :profesional_id AND paciente_id = :paciente_id`,
      {
        profesional_id: nuevo_profesional_id,
        paciente_id
      },
    );
    // 3. Si no está como consultor, agregarlo como Médico Tratante
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
  }
}
