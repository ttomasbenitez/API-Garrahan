const express = require('express');
const router = express.Router();
const { crearProtocolo, obtenerProtocolo } = require('../controllers/protocoloController');

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

router.post('/protocolo', crearProtocolo);
router.get('/protocolo/:id', obtenerProtocolo);

module.exports = router;