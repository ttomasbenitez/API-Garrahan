
export class RecetaDetalle {
  constructor({admin_id, nombre_generico, presentacion,
    concentracion, cantidad, dosis_diaria, numero_dias, dosis_total,
    via_administracion, receta_id = null}) {

    this.receta_id = receta_id;
    this.admin_id = admin_id;
    this.nombre_generico = nombre_generico;
    this.presentacion = presentacion;
    this.concentracion = concentracion;
    this.cantidad = cantidad;
    this.dosis_diaria = dosis_diaria;
    this.numero_dias = numero_dias;
    this.dosis_total = dosis_total;
    this.via_administracion = via_administracion;
  }
}
