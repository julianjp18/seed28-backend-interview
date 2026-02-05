# 🐂 Bulltrack Pro - Backend API

Backend API para Bulltrack Pro, una plataforma avanzada de ranking genético bovino.

## 🛠️ Stack Tecnológico

- **Framework:** NestJS 10+
- **Base de Datos:** PostgreSQL
- **ORM:** TypeORM
- **Autenticación:** JWT (Passport)
- **Validación:** class-validator, class-transformer

## 📋 Prerrequisitos

- Node.js 18+
- PostgreSQL (p. ej. Neon) y su connection string
- npm o yarn

## 🚀 Instalación y Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Copia el archivo `env.example` a `.env` y configura las variables:

```bash
cp env.example .env
```

Edita `.env` con tus credenciales:

```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
JWT_SECRET=tu-secret-key-muy-seguro-minimo-32-caracteres
JWT_EXPIRES_IN=24h
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

La conexión a la base de datos es únicamente por **connection string** (`DATABASE_URL`).

### 3. Crear la base de datos

Crea el proyecto y la base en tu proveedor (ej. Neon), copia la connection string y asígnala a `DATABASE_URL` en `.env`.

### 4. Ejecutar migraciones (si las hay)

```bash
npm run migration:run
```

### 5. Poblar la base de datos con datos iniciales

```bash
npm run seed:run
```

Esto creará:
- Usuario por defecto: `admin@seed28.com` / `seed28`
- 7 toros de ejemplo

### 6. Iniciar el servidor

```bash
# Desarrollo (con hot-reload)
npm run start:dev

# Producción
npm run build
npm run start:prod
```

El servidor estará disponible en `http://localhost:3001`

## 📚 Endpoints de la API

### Autenticación

#### `POST /api/auth/login`
Autenticación de usuario.

**Body:**
```json
{
  "email": "admin@seed28.com",
  "password": "seed28"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@seed28.com",
    "name": "Admin User"
  }
}
```

### Toros

#### `GET /api/bulls`
Lista todos los toros con filtros, paginación y ordenamiento.

**Query Parameters:**
- `search` (string, optional): Search by ear tag or name
- `origin` (enum: `'propio'` | `'catalogo'` | `'favoritos'`, optional)
- `forHeifer` (boolean, optional): Filter by use type = vaquillona (heifer)
- `coat` (enum: `'negro'` | `'colorado'`, optional)
- `sortBy` (enum: `'asc'` | `'desc'`, default: `'desc'`): Sort by bull_score
- `page` (number, default: 1): Current page
- `limit` (number, default: 10): Items per page

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "earTag": "992",
      "name": "Toro Black Emerald",
      "useType": "vaquillona",
      "origin": "propio",
      "coat": "negro",
      "breed": "Angus",
      "ageMonths": 36,
      "standoutFeature": "Top 1% calving ease",
      "stats": {
        "growth": 85,
        "calvingEase": 98,
        "reproduction": 75,
        "moderation": 60,
        "carcass": 82
      },
      "bullScore": 80.5,
      "isFavorite": false
    }
  ],
  "total": 7,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

#### `GET /api/bulls/:id`
Obtiene un toro específico por ID.

#### `GET /api/bulls/favorites`
Lista los toros favoritos del usuario autenticado (con los mismos filtros de query).

#### `POST /api/bulls/:id/favorite`
Agrega un toro a favoritos.

#### `DELETE /api/bulls/:id/favorite`
Elimina un toro de favoritos.

## 🏗️ Arquitectura

### Estructura de Módulos

```
src/
├── auth/           # Autenticación JWT
├── users/          # Gestión de usuarios
├── bulls/          # Gestión de toros y favoritos
├── common/         # Código compartido (decorators, guards, filters)
└── database/       # Configuración DB, seeds, migraciones
```

### Características Principales

1. **Separación por Módulos:** Cada funcionalidad está encapsulada en su propio módulo
2. **Repositorios Personalizados:** Lógica de consultas complejas en `BullsRepository`
3. **DTOs para Validación:** Validación automática de datos de entrada
4. **Guards y Decoradores:** Autenticación y autorización reutilizables
5. **Cálculo Dinámico de Bull Score:** Se calcula en tiempo real usando la fórmula:
   ```
   bullScore = (C × 0.30) + (F × 0.25) + (R × 0.20) + (M × 0.15) + (Ca × 0.10)
   ```

### Base de Datos

#### Esquema Principal

- **users:** Usuarios del sistema
- **bulls:** Información de toros
- **favorites:** Relación many-to-many entre usuarios y toros

#### Índices

Se han creado índices en:
- `bulls.ear_tag` (búsqueda)
- `bulls.origin` (filtrado)
- `bulls.coat` (filtrado)
- `bulls.use_type` (filtrado)
- `favorites.userId` y `favorites.bullId` (consultas de favoritos)

## 🧪 Testing

### Tests unitarios

Tests con mocks para servicios y controladores (no requieren base de datos):

- **Auth:** `auth.service.spec.ts`, `auth.controller.spec.ts` — login, credenciales inválidas, errores inesperados.
- **Bulls:** `bulls.service.spec.ts`, `bulls.controller.spec.ts` — listado, detalle, favoritos, `NotFoundException`.

```bash
# Ejecutar todos los tests unitarios
npm run test

# Con cobertura
npm run test:cov

# En modo watch
npm run test:watch
```

### Tests e2e

Los tests e2e (`test/app.e2e-spec.ts`) levantan la aplicación real y requieren **PostgreSQL** y `DATABASE_URL` en `.env` (por ejemplo, una base de pruebas). Verifican:

- `POST /api/auth/login` — 401 con credenciales inválidas, 400 con body inválido.
- `GET /api/bulls` — 401 sin token.

```bash
# Requiere DATABASE_URL configurado
npm run test:e2e
```

## 🔒 Seguridad

- Autenticación JWT obligatoria para todas las rutas (excepto login)
- Validación de datos de entrada con `class-validator`
- Passwords hasheados con bcrypt
- CORS configurado para el frontend

## 📈 Escalabilidad

El sistema está diseñado para escalar:

- **Paginación del lado del servidor:** No carga todos los registros en memoria
- **Índices en base de datos:** Consultas optimizadas para filtros frecuentes
- **Cálculo de score en la query:** Eficiente para grandes volúmenes
- **Repositorios personalizados:** Fácil optimizar consultas específicas

### Consideraciones para 100,000+ registros

- Agregar índices compuestos según patrones de consulta
- Implementar caché (Redis) para consultas frecuentes
- Considerar particionamiento de tablas si es necesario
- Optimizar queries con `EXPLAIN ANALYZE`

## 🚀 Mejoras Futuras

Si tuviera 2 semanas más, implementaría:

1. **Caché:** Redis para consultas frecuentes y reducir carga en DB
2. **Ampliar tests:** E2E con DB de test, tests del repositorio y de UsersService
3. **Documentación API:** Swagger/OpenAPI con decoradores NestJS
4. **Logging estructurado:** Winston o Pino con niveles y contexto
5. **Rate Limiting:** Protección contra abuso de API
6. **WebSockets:** Notificaciones en tiempo real para favoritos
7. **Búsqueda avanzada:** Full-text search con PostgreSQL o Elasticsearch
8. **Exportación de datos:** CSV/Excel para reportes
9. **Auditoría:** Logs de cambios en datos críticos
10. **Health checks:** Endpoints para monitoreo y alertas

## 📝 Scripts Disponibles

- `npm run start:dev` - Desarrollo con hot-reload
- `npm run build` - Compilar para producción
- `npm run start:prod` - Ejecutar versión compilada
- `npm run seed:run` - Ejecutar seeds de datos iniciales
- `npm run test` - Ejecutar tests
- `npm run lint` - Linter

## 🤝 Contribución

Este es un proyecto de challenge técnico para Seed28.

## 📄 Licencia

MIT
# seed28-interview
