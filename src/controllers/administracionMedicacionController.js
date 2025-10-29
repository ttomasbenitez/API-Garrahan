export function makeAdministracionMedicacionController(service) {
  return {
    async getById(req, res) {
      try {
        const { admin_id } = req.params;
        const admin = await service.obtenerPorId(admin_id);
        if (!admin) return res.status(404).json({ error: 'No encontrada' });
        res.json(admin);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  };
}
