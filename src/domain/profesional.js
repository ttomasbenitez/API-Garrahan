class Profesional {
  constructor(nombre, apellido, dni, matricula, especialidad, profesional_id) {
    if (!nombre || !apellido || !dni) throw new Error('Faltan datos obligatorios');

    this.nombre = nombre;
    this.apellido = apellido;
    this.dni = dni;
    this.matricula = matricula ?? null;
    this.especialidad = especialidad ?? null;
    this.profesional_id = profesional_id ?? null;
  }
}

export default Profesional;
