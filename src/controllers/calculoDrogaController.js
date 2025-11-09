export function makeCalculoDrogaController(service) {
  return {
    async calcular(req, res) {
      try {
        const { administracion_id, peso, nueva_fuerza_valor, nueva_fuerza_unidad, nombre_droga } = req.body;
        const peso_float = parseFloat(peso);
        const resultado = await service.calcular({
          administracion_id,
          peso: peso_float,
          nueva_fuerza_valor,
          nueva_fuerza_unidad,
          nombre_droga
        });
        res.json(resultado);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    }
  };
}
