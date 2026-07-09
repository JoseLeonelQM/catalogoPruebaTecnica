# Prueba tecnica - Jose Leonel Quispe Mantilla

Prueba Técnica Full Stack desarrollada para Vertex.
Sistema de gestión de catálogo de productos con autenticación JWT, roles de usuario, CRUD completo, optimización de imágenes y almacenamiento en Supabase Storage.

---

# Tecnologías

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

OJO: TENER NODE.JS Y NPM ACTUALIZADO PARA EVITAR PROBLEMAS
Crear el archivo `.env` utilizando como referencia `.env.example`, los mismos datos para accedes a mi base de datos supabase que esta levantado.

Generar Prisma Client:

```bash
npx prisma generate
```

Iniciar servidor:

```bash
npm run dev
```

Servidor:

```

Tenemos tambien un archivo seed para ejecutar con datos poblados y un usuario y admin con 10 productos que se ejecuto al inicio:

```bash
npm run seed
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


# Usuarios de prueba

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

# Estrategia de optimización de imágenes

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

# Seguridad

- Autenticación mediante JWT.
- Contraseñas cifradas con bcrypt.
- Middleware de autorización.
- Validación de datos en servidor.
- Variables de entorno.
- Validación de tipo y tamaño de imágenes.

---

# API REST

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


# Autor

Jose Leonel Quispe Mantilla

Prueba Técnica Full Stack - Vertex