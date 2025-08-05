const knex = require('../db/knex');

async function crearProtocolo(req, res) {
  const { nombre, enfermedad, linea } = req.body;
  if (!nombre || !enfermedad || !linea) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }
  try {
    const [protocolo_id] = await knex('protocolo')
      .insert({ nombre, enfermedad, linea })
      .returning('protocolo_id');
    res.status(201).json({
      protocolo_id: protocolo_id,
      nombre,
      enfermedad,
      linea
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function obtenerProtocolo(req, res) {
  const { id } = req.params;
  try {
    const protocolo = await knex('protocolo')
      .select('protocolo_id', 'nombre', 'enfermedad', 'linea')
      .where({ protocolo_id: id })
      .first();
    if (!protocolo) {
      return res.status(404).json({ error: 'No encontrado' });
    }
    res.json(protocolo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { crearProtocolo, obtenerProtocolo };
