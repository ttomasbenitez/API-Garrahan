import express from 'express';
import { generateToken } from '../middleware/auth.js';

const router = express.Router();

// Login de prueba
router.post('/login-test', (req, res) => {
  const { id, name, role } = req.body;

  if (!id || !name || !role) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  const token = generateToken({ id, name, role });

  res.cookie('session', token, {
    httpOnly: true,
    secure: false,       // true solo en HTTPS
    sameSite: 'lax',
    maxAge: 60 * 60 * 1000,
  });

  res.json({ message: 'Sesión iniciada (test)' });
});

export default router;
