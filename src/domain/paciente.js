class Paciente {
  constructor(nombre, apellido, id_hospitalario, fecha_nacimiento, peso, sexo, profesional_id, id, ultima_modificacion, obra_social) {
    if (!id_hospitalario) throw new Error('id_hospitalario es obligatorio');
    if (!profesional_id) throw new Error('profesional_id es obligatorio');

    this.nombre = nombre ?? null;
    this.apellido = apellido ?? null;
    this.id_hospitalario = id_hospitalario;
    this.fecha_nacimiento = fecha_nacimiento ?? null;
    this.peso = peso ?? null;
    this.sexo = sexo ?? null;
    this.profesional_id = profesional_id;
    this.id = id ?? null;
    this.ultima_modificacion = ultima_modificacion ?? null;
    this.obra_social = obra_social ?? null;
  }
}

export default Paciente;
