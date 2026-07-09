import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_por_defecto';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Token no proporcionado o formato inválido.' });
    return;
  }

  // 1. Extraemos el token seguro
  const token = authHeader.split(' ')[1];

  // 2. Validación obligatoria para evitar el error 'string | undefined'
  if (!token) {
    res.status(401).json({ message: 'Formato de token inválido.' });
    return;
  }

  try {
    // 3. Ahora 'token' es garantizado un string puro aquí
    const decoded = jwt.verify(token, JWT_SECRET) as unknown as { userId: string; email: string; role: string };
    
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Token inválido o expirado.' });
  }
};