class PresentacionDrogaVia {
  constructor(via_id, presentacion_id, es_default = '0') {
    this.via_id = via_id ?? null;
    this.presentacion_id = presentacion_id ?? null;
    this.es_default = es_default ?? '0';
  }
}

export default PresentacionDrogaVia;
