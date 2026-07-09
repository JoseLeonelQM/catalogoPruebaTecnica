import { Router } from 'express';
import { login } from '../controllers/auth.controller';

const router = Router();

// Endpoint para iniciar sesión: POST /api/auth/login
router.post('/login', login);

export default router;