import dotenv from 'dotenv';
// 🔥 ¡Obligatorio configurarlo aquí arriba antes de importar Prisma!
dotenv.config(); 

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import itemRoutes from './routes/item.routes';

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares globales
app.use(cors());
app.use(express.json());

// 🛣️ Registro de Endpoints Globales
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

// Ruta de diagnóstico (Health Check)
app.get('/api/health', (req, res) => {
  res.json({ status: 'up', message: 'Servidor corriendo perfectamente' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend listo en http://localhost:${PORT}`);
});