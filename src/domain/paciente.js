class Paciente {
  constructor(nombre, apellido, id_hospitalario, fecha_nacimiento, peso, sexo, obra_social, ultima_modificacion, paciente_id) {

    this.nombre = nombre ?? null;
    this.apellido = apellido ?? null;
    this.id_hospitalario = id_hospitalario;
    this.fecha_nacimiento = fecha_nacimiento ?? null;
    this.peso = peso ?? null;
    this.sexo = sexo ?? null;
    this.paciente_id = paciente_id ?? null;
    this.ultima_modificacion = ultima_modificacion ?? null;
    this.obra_social = obra_social ?? null;
  }
}

export default Paciente;
