import jwt from 'jsonwebtoken';
import config from '../../config.js';

// Genera token JWT con id, nombre y role
export function generateToken(user) {
  return jwt.sign(
    { id: user.id, name: user.name, role: user.role },
    config.app.jwtSecret,
    { expiresIn: '1h' }
  );
}

// Middleware de autenticación
export function authMiddleware(req, res, next) {
  const token = req.cookies?.session;
  if (!token) return res.status(401).json({ error: 'No loggeado' });

  try {
    const user = jwt.verify(token, config.app.jwtSecret);
    req.user = user;
    next();
  } catch (_err) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
}

// Middleware de autorización por roles
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'No loggeado' });
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'No autorizado' });
    }
    next();
  };
}
