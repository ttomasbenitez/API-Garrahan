export function makeCalculoDrogaController(service) {
  return {
    async calcular(req, res) {
      try {
        const { administracion_id, peso, nueva_fuerza_valor, nueva_fuerza_unidad } = req.body;
        const resultado = await service.calcular({ administracion_id, peso, nueva_fuerza_valor, nueva_fuerza_unidad });
        res.json(resultado);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    }
  };
}
