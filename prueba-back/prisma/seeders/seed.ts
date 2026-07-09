import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv'; // 👈 Añade esta importación
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// 🔥 Carga las variables de entorno de inmediato
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log('🌱 Iniciando el sembrado de la base de datos...');

  // 1. Limpiar datos existentes (Opcional, evita duplicados en pruebas)
  await prisma.item.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Encriptar contraseñas de prueba
  const hashedAdminPassword = await bcrypt.hash('admin123*', 10);
  const hashedUserPassword = await bcrypt.hash('user123*', 10);

  // 3. Crear el usuario Administrador
  const admin = await prisma.user.create({
    data: {
      email: 'admin@gmail.com',
      password: hashedAdminPassword,
      name: 'Administrador',
      role: Role.ADMIN,
    },
  });
  console.log(`✅ Usuario ADMIN creado: ${admin.email}`);

  // 4. Crear un usuario Regular
  const user = await prisma.user.create({
    data: {
      email: 'user@gmail.com',
      password: hashedUserPassword,
      name: 'Usuario',
      role: Role.USER,
    },
  });
  console.log(`✅ Usuario USER creado: ${user.email}`);

  // 5. Crear ítems/productos por defecto asociados al ADMIN
  console.log('📦 Poblando productos iniciales...');
  
  await prisma.item.createMany({
    data: [
      {
        name: 'Laptop Gamer HyperX',
        description: 'Procesador de última generación, 16GB RAM, 512GB SSD. Ideal para desarrollo y gaming.',
        price: 1299.99,
        category: 'Electrónica',
        imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80', // URLs reales provisionales
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
      }
    ],
  });

  console.log('✨ Base de datos poblada con éxito.');
}

main()
  .catch((e) => {
    console.error('❌ Error ejecutando el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });