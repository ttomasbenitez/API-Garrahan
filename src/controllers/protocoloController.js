const { connectToDatabase } = require('../db/oracle');

async function crearProtocolo(req, res) {
  const { nombre, enfermedad, linea } = req.body;
  if (!nombre || !enfermedad || !linea) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }
  try {
    const conn = await connectToDatabase();
    const result = await conn.execute(
      `INSERT INTO protocolo (nombre, enfermedad, linea)
       VALUES (:nombre, :enfermedad, :linea)
       RETURNING protocolo_id INTO :id`,
      { nombre, enfermedad, linea, id: { dir: require('oracledb').BIND_OUT, type: require('oracledb').NUMBER } },
      { autoCommit: true }
    );
    res.status(201).json({
      protocolo_id: result.outBinds.id[0],
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
    const conn = await connectToDatabase();
    const result = await conn.execute(
      'SELECT protocolo_id, nombre, enfermedad, linea FROM protocolo WHERE protocolo_id = :id',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No encontrado' });
    }
    const [protocolo_id, nombre, enfermedad, linea] = result.rows[0];
    res.json({ protocolo_id, nombre, enfermedad, linea });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { crearProtocolo, obtenerProtocolo };
