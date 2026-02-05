# 🐂 Bulltrack Pro - Backend API

Backend API for Bulltrack Pro, an advanced bovine genetic ranking platform.

## 🌐 Demo

- **Frontend:** [https://seed28-frontend-interview.onrender.com](https://seed28-frontend-interview.onrender.com)
- **Backend API:** [https://seed28-backend-interview.onrender.com](https://seed28-backend-interview.onrender.com)
- **Database:** Hosted on [Neon](https://neon.tech) (PostgreSQL).

Default credentials: `admin@seed28.com` / `seed28`

## 🛠️ Tech Stack

- **Framework:** NestJS 10+
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Authentication:** JWT (Passport)
- **Validation:** class-validator, class-transformer

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL (e.g. Neon) and its connection string
- npm or yarn

## 🚀 Installation and Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the `env.example` file to `.env` and set the variables:

```bash
cp env.example .env
```

Edit `.env` with your credentials:

```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
JWT_SECRET=your-very-secure-secret-key-minimum-32-characters
JWT_EXPIRES_IN=24h
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Database connection is **connection string only** (`DATABASE_URL`).

### 3. Create the database

Create the project and database in your provider (e.g. Neon), copy the connection string and set it as `DATABASE_URL` in `.env`.

### 4. Run migrations (if any)

```bash
npm run migration:run
```

### 5. Seed the database with initial data

```bash
npm run seed:run
```

This will create:
- Default user: `admin@seed28.com` / `seed28`
- 7 sample bulls

### 6. Start the server

```bash
# Development (with hot-reload)
npm run start:dev

# Production
npm run build
npm run start:prod
```

The server will be available at `http://localhost:3001`

## 📚 API Endpoints

### Authentication

#### `POST /api/auth/login`
User authentication.

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

### Bulls

#### `GET /api/bulls`
List all bulls with filters, pagination and sorting.

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
Get a specific bull by ID.

#### `GET /api/bulls/favorites`
List the authenticated user's favorite bulls (with the same query filters).

#### `POST /api/bulls/:id/favorite`
Add a bull to favorites.

#### `DELETE /api/bulls/:id/favorite`
Remove a bull from favorites.

## 🏗️ Architecture

### Module Structure

```
src/
├── auth/           # JWT authentication
├── users/          # User management
├── bulls/          # Bulls and favorites management
├── common/         # Shared code (decorators, guards, filters)
└── database/       # DB config, seeds, migrations
```

### Main Features

1. **Module Separation:** Each feature is encapsulated in its own module
2. **Custom Repositories:** Complex query logic in `BullsRepository`
3. **DTOs for Validation:** Automatic validation of input data
4. **Guards and Decorators:** Reusable authentication and authorization
5. **Dynamic Bull Score Calculation:** Computed in real time using the formula:
   ```
   bullScore = (C × 0.30) + (F × 0.25) + (R × 0.20) + (M × 0.15) + (Ca × 0.10)
   ```

### Database

#### Main Schema

- **users:** System users
- **bulls:** Bull information
- **favorites:** Many-to-many relationship between users and bulls

#### Indexes

Indexes have been created on:
- `bulls.ear_tag` (search)
- `bulls.origin` (filtering)
- `bulls.coat` (filtering)
- `bulls.use_type` (filtering)
- `favorites.userId` and `favorites.bullId` (favorites queries)

## 🧪 Testing

### Unit tests

Tests with mocks for services and controllers (no database required):

- **Auth:** `auth.service.spec.ts`, `auth.controller.spec.ts` — login, invalid credentials, unexpected errors.
- **Bulls:** `bulls.service.spec.ts`, `bulls.controller.spec.ts` — list, detail, favorites, `NotFoundException`.

```bash
# Run all unit tests
npm run test

# With coverage
npm run test:cov

# Watch mode
npm run test:watch
```

### E2E tests

E2E tests (`test/app.e2e-spec.ts`) spin up the real application and require **PostgreSQL** and `DATABASE_URL` in `.env` (e.g. a test database). They verify:

- `POST /api/auth/login` — 401 with invalid credentials, 400 with invalid body.
- `GET /api/bulls` — 401 without token.

```bash
# Requires DATABASE_URL to be configured
npm run test:e2e
```

## 🔒 Security

- JWT authentication required for all routes (except login)
- Input validation with `class-validator`
- Passwords hashed with bcrypt
- CORS configured for the frontend

## 📈 Scalability

The system is designed to scale:

- **Server-side pagination:** Does not load all records into memory
- **Database indexes:** Optimized queries for frequent filters
- **Score calculation in the query:** Efficient for large volumes
- **Custom repositories:** Easy to optimize specific queries

### Considerations for 100,000+ records

- Add composite indexes based on query patterns
- Implement cache (Redis) for frequent queries
- Consider table partitioning if needed
- Optimize queries with `EXPLAIN ANALYZE`

## 🚀 Future Improvements

With 2 more weeks, I would implement:

1. **Cache:** Redis for frequent queries and reduced DB load
2. **Expand tests:** E2E with test DB, repository and UsersService tests
3. **API documentation:** Swagger/OpenAPI with NestJS decorators
4. **Structured logging:** Winston or Pino with levels and context
5. **Rate limiting:** API abuse protection
6. **WebSockets:** Real-time notifications for favorites
7. **Advanced search:** Full-text search with PostgreSQL or Elasticsearch
8. **Data export:** CSV/Excel for reports
9. **Audit:** Logs for changes to critical data
10. **Health checks:** Endpoints for monitoring and alerts

## 📝 Available Scripts

- `npm run start:dev` - Development with hot-reload
- `npm run build` - Build for production
- `npm run start:prod` - Run compiled version
- `npm run seed:run` - Run initial data seeds
- `npm run test` - Run tests
- `npm run lint` - Linter

## 🤝 Contributing

This is a technical challenge project for Seed28.

## 📄 License

MIT
