import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Iniciando el sembrado de la base de datos...');

  await prisma.item.deleteMany({});
  await prisma.user.deleteMany({});

  const hashedAdminPassword = await bcrypt.hash('admin123*', 10);
  const hashedUserPassword = await bcrypt.hash('user123*', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@gmail.com',
      password: hashedAdminPassword,
      name: 'Administrador',
      role: Role.ADMIN,
    },
  });
  console.log(`Usuario creado: ${admin.email}`);

  const user = await prisma.user.create({
    data: {
      email: 'user@gmail.com',
      password: hashedUserPassword,
      name: 'Usuario',
      role: Role.USER,
    },
  });
  console.log(`Usuario creado: ${user.email}`);

  console.log('Poblando 10 productos iniciales...');
  
  const seedProducts = [
    {
      name: 'Laptop Gamer HyperX',
      description: 'Procesador de última generación, 16GB RAM, 512GB SSD. Ideal para desarrollo y gaming.',
      price: 1299.99,
      category: 'Electrónica',
      imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80',
      userId: admin.id,
    },
    {
      name: 'Teclado Mecánico RGB',
      description: 'Switches mecánicos silenciosos, retroiluminación RGB personalizable y layout en español.',
      price: 89.50,
      category: 'Accesorios',
      imageUrl: 'https://images.unsplash.com/photo-1618384887929-16ec33faf9ef?w=500&q=80',
      userId: admin.id,
    },
    {
      name: 'Monitor UltraWide 34"',
      description: 'Resolución QHD, tasa de refresco de 144Hz, panel IPS para la máxima precisión de color.',
      price: 450.00,
      category: 'Electrónica',
      imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80',
      userId: admin.id,
    },
    {
      name: 'Mouse Ergonómico Inalámbrico',
      description: 'Sensor de alta precisión de 16000 DPI, batería de larga duración y diseño ergonómico.',
      price: 59.99,
      category: 'Accesorios',
      imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&q=80',
      userId: admin.id,
    },
    {
      name: 'Auriculares Noise Cancelling',
      description: 'Cancelación activa de ruido híbrida, audio de alta resolución y 40 horas de autonomía.',
      price: 199.99,
      category: 'Audio',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
      userId: admin.id,
    },
    {
      name: 'Silla Gamer Ergonómica',
      description: 'Soporte lumbar ajustable, reposabrazos 4D y reclinación de hasta 180 grados.',
      price: 249.50,
      category: 'Mobiliario',
      imageUrl: 'https://images.unsplash.com/photo-1598550476439-6847785fce6e?w=500&q=80',
      userId: admin.id,
    },
    {
      name: 'Micrófono para Streaming',
      description: 'Patrón polar cardioide, conexión USB plug-and-play, ideal para podcasts y streams.',
      price: 120.00,
      category: 'Audio',
      imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500&q=80',
      userId: admin.id,
    },
    {
      name: 'Cámara Web 4K',
      description: 'Enfoque automático rápido, micrófonos duales integrados y corrección de luz automática.',
      price: 95.00,
      category: 'Electrónica',
      imageUrl: 'https://images.unsplash.com/photo-1600541519463-f90ab88806cf?w=500&q=80',
      userId: admin.id,
    },
    {
      name: 'Escritorio Elevable Eléctrico',
      description: 'Estructura de acero con doble motor, memoria de altura y panel de control digital.',
      price: 380.00,
      category: 'Mobiliario',
      imageUrl: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=500&q=80',
      userId: admin.id,
    },
    {
      name: 'Hub USB-C 8 en 1',
      description: 'Salida HDMI 4K, puertos USB 3.0, lector de tarjetas SD/TF y entrega de energía de 100W.',
      price: 45.00,
      category: 'Accesorios',
      imageUrl: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=500&q=80',
      userId: admin.id,
    },
  ];

  await prisma.item.createMany({
    data: seedProducts,
  });

  console.log('Base de datos poblada con éxito.');
}

main()
  .catch((e) => {
    console.error('Error ejecutando el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });