import dotenv from 'dotenv';
dotenv.config(); 

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import itemRoutes from './routes/item.routes';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'up', message: 'Servidor corriendo perfectamente' });
});

app.listen(PORT, () => {
  console.log(`Servidor backend listo en http://localhost:${PORT}`);
});