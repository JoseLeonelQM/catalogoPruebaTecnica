# 📦 Catálogo XYZ

Prueba técnica Full Stack para Vertex.

Aplicación web desarrollada con React + Express + Prisma + PostgreSQL que permite la gestión de un catálogo de productos con autenticación mediante JWT, roles de usuario, carga y optimización de imágenes, búsqueda, filtros y paginación.

---

# 🚀 Tecnologías utilizadas

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

## Almacenamiento

- Supabase Storage

---

# ✨ Funcionalidades

## Autenticación

- Registro de usuarios
- Inicio de sesión
- JWT
- Protección de rutas
- Roles:
  - ADMIN
  - USER

## Catálogo

- Crear productos
- Editar productos
- Eliminar productos
- Listar productos
- Buscar por nombre o descripción
- Filtrar por categoría
- Paginación

## Imágenes

- Compresión en cliente
- Optimización en servidor con Sharp
- Conversión automática a WebP
- Almacenamiento en Supabase Storage
- En la base de datos únicamente se almacena la URL pública de la imagen.

---

# 📂 Arquitectura

## Backend

```
src/
│
├── config/
├── controllers/
├── middlewares/
├── routes/
├── services/
├── prisma/
└── index.ts
```

## Frontend

```
src/
│
├── components/
├── hooks/
├── screens/
├── services/
├── types/
├── utils/
└── App.tsx
```

---

# 🖼 Estrategia de optimización de imágenes

Se implementó una estrategia híbrida.

## Cliente

Antes de enviar la imagen se utiliza:

- browser-image-compression

Esto reduce el tamaño del archivo y disminuye el tiempo de subida.

## Servidor

Después de recibir la imagen se procesa utilizando Sharp:

- Conversión a WebP
- Calidad 80%
- Redimensionado máximo de 800 px
- Optimización para almacenamiento

Posteriormente la imagen optimizada se almacena en Supabase Storage.

La base de datos únicamente guarda la URL generada por Supabase.

---

# 🔐 Seguridad

- JWT para autenticación.
- Middleware de autorización.
- Validación de datos en servidor.
- Variables de entorno.
- Contraseñas cifradas mediante bcrypt.
- Validación del propietario del recurso para editar y eliminar productos.

---

# ⚙ Variables de entorno

## Backend

Crear un archivo `.env`

```
DATABASE_URL=

DIRECT_URL=

JWT_SECRET=

SUPABASE_URL=

SUPABASE_SERVICE_ROLE_KEY=

SUPABASE_BUCKET=imagesCatalog
```

## Frontend

```
VITE_API_URL=http://localhost:4000/api
```

---

# ▶ Instalación

## Backend

```bash
cd prueba-back

npm install

npx prisma generate

npm run dev
```

Servidor:

```
http://localhost:4000
```

---

## Frontend

```bash
cd prueba-front

npm install

npm run dev
```

Aplicación:

```
http://localhost:5173
```

---

# 👥 Usuarios

El sistema soporta dos tipos de usuarios.

## ADMIN

Puede:

- Crear productos
- Editar productos
- Eliminar productos
- Consultar catálogo

## USER

Puede:

- Consultar catálogo
- Buscar productos
- Filtrar productos
- Navegar mediante paginación

---

# 📌 API

## Auth

```
POST /api/auth/register

POST /api/auth/login
```

## Items

```
GET    /api/items

POST   /api/items

PUT    /api/items/:id

DELETE /api/items/:id
```

---

# 📸 Gestión de imágenes

Las imágenes se almacenan en Supabase Storage.

Formato:

- WebP

Optimización:

- Sharp

Base de datos:

- URL pública únicamente

---

# 👨‍💻 Autor

Jose Leonel Quispe Mantilla

Prueba Técnica - Vertex