# 📦 Catálogo XYZ

Prueba Técnica Full Stack desarrollada para Vertex.

Sistema de gestión de catálogo de productos con autenticación JWT, roles de usuario, CRUD completo, optimización de imágenes y almacenamiento en Supabase Storage.

---

# 🚀 Tecnologías

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios

## Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL (Supabase)
- JWT
- Multer
- Sharp

## Servicios

- Supabase Storage

---

# ✨ Características

- Autenticación mediante JWT
- Roles de usuario (ADMIN y USER)
- CRUD completo de productos
- Búsqueda por nombre/descripción
- Filtro por categoría
- Paginación
- Optimización automática de imágenes
- Conversión a WebP
- Responsive
- Validación de datos en servidor

---

# 📂 Estructura del proyecto

```
catalogoPruebaTecnica/
│
├── prueba-back/
│
└── prueba-front/
```

---

# ⚙️ Instalación

## 1. Clonar el proyecto

```bash
git clone <url-del-repositorio>

cd catalogoPruebaTecnica
```

---

## 2. Backend

```bash
cd prueba-back

npm install
```

Crear el archivo `.env` utilizando como referencia `.env.example`.

Generar Prisma Client:

```bash
npx prisma generate
```

Ejecutar migraciones:

```bash
npx prisma migrate deploy
```

Poblar la base de datos con datos de prueba:

```bash
npm run seed
```

Iniciar servidor:

```bash
npm run dev
```

Servidor:

```
http://localhost:4000
```

---

## 3. Frontend

```bash
cd ../prueba-front

npm install
```

Crear el archivo `.env` utilizando como referencia `.env.example`.

Iniciar aplicación:

```bash
npm run dev
```

Aplicación:

```
http://localhost:5173
```

---

# 🌱 Seed

El proyecto incluye un **seed** que genera automáticamente información inicial para facilitar las pruebas.

El seed realiza las siguientes acciones:

- Elimina datos existentes.
- Crea un usuario administrador.
- Crea un usuario estándar.
- Inserta productos de ejemplo.

Ejecutar:

```bash
npm run seed
```

---

# 👤 Usuarios de prueba

## Administrador

**Correo**

```
admin@gmail.com
```

**Contraseña**

```
admin123*
```

Permisos:

- Crear productos
- Editar productos
- Eliminar productos
- Visualizar catálogo

---

## Usuario

**Correo**

```
user@gmail.com
```

**Contraseña**

```
user123*
```

Permisos:

- Consultar catálogo
- Buscar productos
- Filtrar productos
- Navegar mediante paginación

---

# 🖼️ Estrategia de optimización de imágenes

Se implementó una estrategia híbrida para optimizar el rendimiento y el almacenamiento.

## Cliente

Antes de subir una imagen se utiliza **browser-image-compression**, reduciendo el tamaño del archivo y el tiempo de carga.

## Servidor

Posteriormente el backend procesa la imagen utilizando **Sharp**, aplicando:

- Conversión automática a WebP.
- Calidad 80%.
- Redimensionado máximo de 800 px de ancho.

Finalmente la imagen optimizada se almacena en **Supabase Storage**.

La base de datos únicamente almacena la URL pública de la imagen.

---

# 🔒 Seguridad

- Autenticación mediante JWT.
- Contraseñas cifradas con bcrypt.
- Middleware de autorización.
- Validación de datos en servidor.
- Variables de entorno.
- Validación de tipo y tamaño de imágenes.

---

# 📌 API REST

## Auth

```
POST /api/auth/register

POST /api/auth/login
```

## Productos

```
GET    /api/items

POST   /api/items

PUT    /api/items/:id

DELETE /api/items/:id
```

---

# 📄 Variables de entorno

## Backend

```env
DATABASE_URL=

DIRECT_URL=

JWT_SECRET=

SUPABASE_URL=

SUPABASE_SERVICE_ROLE_KEY=

SUPABASE_BUCKET=imagesCatalog
```

## Frontend

```env
VITE_API_URL=http://localhost:4000/api
```

---

# 👨‍💻 Autor

Jose Leonel Quispe Mantilla

Prueba Técnica Full Stack - Vertex