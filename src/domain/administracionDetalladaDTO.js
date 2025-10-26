class AdministracionDetalladaDTO {
  constructor(admin_id, nombre_droga, via_administracion, formato_droga, fuerza_valor, fuerza_unidad, cantidad_dias, administracion_diaria, frecuencia_diaria) {
    this.admin_id = admin_id;
    this.nombre_droga = nombre_droga;
    this.via_administracion = via_administracion;
    this.formato_droga = formato_droga;
    this.fuerza_valor = fuerza_valor;
    this.fuerza_unidad = fuerza_unidad;
    this.cantidad_dias = cantidad_dias;
    this.administracion_diaria = administracion_diaria;
    this.frecuencia_diaria = frecuencia_diaria;
  }
}

export default AdministracionDetalladaDTO;
