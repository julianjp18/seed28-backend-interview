# Database Schema — Bulltrack Pro

PostgreSQL schema for **Bulls**, **Users**, and the **Favorite** relationship. Designed for scalability and optimized queries (filters, search, sorting, pagination).

**Apply directly:** run [`schema.sql`](./schema.sql) against your PostgreSQL database (e.g. `psql -U user -d dbname -f docs/schema.sql`). The script is re-runnable (drops existing objects first).

---

## 1. Entity Relationship Overview

- **users**: Authenticated users (JWT).
- **bulls**: Bulls with genetic/ranking data and stats.
- **favorites**: Many-to-many between users and bulls (user-scoped favorites).

---

## 2. ENUMs (Domain Values)

```sql
CREATE TYPE use_type AS ENUM ('vaquillona', 'vaca');
CREATE TYPE origin_type AS ENUM ('propio', 'catalogo');
CREATE TYPE coat_type AS ENUM ('negro', 'colorado');
```

*Note: The "favoritos" filter in the UI is resolved in the query by joining with the favorites table for the current user, not as a value in `bulls.origin`.*

---

## 3. Table: `users`

| Column      | Type         | Constraints        | Description                |
|------------|--------------|--------------------|----------------------------|
| id         | UUID         | PRIMARY KEY        | Default: gen_random_uuid() |
| email      | VARCHAR(255) | NOT NULL, UNIQUE   | Login identifier           |
| password   | VARCHAR(255) | NOT NULL           | Hashed password            |
| name       | VARCHAR(255) | NULL               | Display name (optional)    |
| created_at | TIMESTAMPTZ  | NOT NULL, DEFAULT now() | Creation time        |
| updated_at | TIMESTAMPTZ  | NOT NULL, DEFAULT now() | Last update time     |

```sql
CREATE TABLE users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      VARCHAR(255) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  name       VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_email ON users (email);
```

---

## 4. Table: `bulls`

| Column           | Type          | Constraints                    | Description |
|------------------|---------------|--------------------------------|-------------|
| id               | BIGSERIAL     | PRIMARY KEY                    | Surrogate key |
| ear_tag          | VARCHAR(50)   | NOT NULL, UNIQUE               | Ear tag (caravana); searchable |
| name             | VARCHAR(255)  | NOT NULL                       | Bull name; searchable |
| use_type         | use_type      | NOT NULL                       | vaquillona \| vaca ("Para vaquillona" filter) |
| origin           | origin_type   | NOT NULL                       | propio \| catalogo (sidebar filter) |
| coat             | coat_type     | NOT NULL                       | negro \| colorado (Pelaje filter) |
| breed            | VARCHAR(100)  | NOT NULL                       | Breed (e.g. Angus, Brangus) |
| age_months       | SMALLINT      | NOT NULL, CHECK > 0            | Age in months |
| standout_feature | TEXT          | NULL                           | Optional highlighted feature |
| growth           | SMALLINT      | NOT NULL, CHECK 0–100          | Crecimiento (C) |
| calving_ease     | SMALLINT      | NOT NULL, CHECK 0–100         | Facilidad de parto (F) |
| reproduction     | SMALLINT      | NOT NULL, CHECK 0–100         | Reproducción (R) |
| moderation       | SMALLINT      | NOT NULL, CHECK 0–100         | Moderación (M) |
| carcass          | SMALLINT      | NOT NULL, CHECK 0–100         | Carcasa (Ca) |
| bull_score       | NUMERIC(5,2)  | GENERATED ALWAYS AS (formula) STORED | (C×0.30)+(F×0.25)+(R×0.20)+(M×0.15)+(Ca×0.10) |
| created_at       | TIMESTAMPTZ   | NOT NULL, DEFAULT now()       | Creation time |
| updated_at       | TIMESTAMPTZ   | NOT NULL, DEFAULT now()       | Last update time |

**Bull score formula:**

```text
bull_score = (growth × 0.30) + (calving_ease × 0.25) + (reproduction × 0.20) + (moderation × 0.15) + (carcass × 0.10)
```

```sql
CREATE TABLE bulls (
  id               BIGSERIAL PRIMARY KEY,
  ear_tag          VARCHAR(50) NOT NULL,
  name             VARCHAR(255) NOT NULL,
  use_type         use_type NOT NULL,
  origin           origin_type NOT NULL,
  coat             coat_type NOT NULL,
  breed            VARCHAR(100) NOT NULL,
  age_months       SMALLINT NOT NULL CHECK (age_months > 0),
  standout_feature TEXT,
  growth           SMALLINT NOT NULL CHECK (growth BETWEEN 0 AND 100),
  calving_ease     SMALLINT NOT NULL CHECK (calving_ease BETWEEN 0 AND 100),
  reproduction     SMALLINT NOT NULL CHECK (reproduction BETWEEN 0 AND 100),
  moderation       SMALLINT NOT NULL CHECK (moderation BETWEEN 0 AND 100),
  carcass          SMALLINT NOT NULL CHECK (carcass BETWEEN 0 AND 100),
  bull_score       NUMERIC(5,2) GENERATED ALWAYS AS (
    growth * 0.30 + calving_ease * 0.25 + reproduction * 0.20 +
    moderation * 0.15 + carcass * 0.10
  ) STORED,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_bulls_ear_tag ON bulls (ear_tag);
CREATE INDEX idx_bulls_name_lower ON bulls (LOWER(name));
CREATE INDEX idx_bulls_ear_tag_lower ON bulls (LOWER(ear_tag));
CREATE INDEX idx_bulls_origin ON bulls (origin);
CREATE INDEX idx_bulls_coat ON bulls (coat);
CREATE INDEX idx_bulls_use_type ON bulls (use_type);
CREATE INDEX idx_bulls_bull_score_desc ON bulls (bull_score DESC);
CREATE INDEX idx_bulls_bull_score_asc ON bulls (bull_score ASC);
```

*Optional (fuzzy search):* `CREATE EXTENSION IF NOT EXISTS pg_trgm;` then add GIN indexes on `ear_tag` and `name` with `gin_trgm_ops`.

---

## 5. Table: `favorites`

| Column     | Type        | Constraints                    | Description |
|------------|-------------|--------------------------------|-------------|
| user_id    | UUID        | NOT NULL, FK → users(id) ON DELETE CASCADE | User who favorited |
| bull_id    | BIGINT      | NOT NULL, FK → bulls(id) ON DELETE CASCADE | Bull favorited |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now()        | When favorited |

**Primary key:** `(user_id, bull_id)` — one row per user–bull pair.

```sql
CREATE TABLE favorites (
  user_id    UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  bull_id    BIGINT NOT NULL REFERENCES bulls (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, bull_id)
);

CREATE INDEX idx_favorites_user_id ON favorites (user_id);
CREATE INDEX idx_favorites_bull_id ON favorites (bull_id);
```

---

## 6. Index Summary

| Table      | Index / Purpose |
|-----------|------------------|
| users     | `email` (UNIQUE; login) |
| bulls     | `ear_tag` (UNIQUE), `name`, `origin`, `coat`, `use_type`, `bull_score` (ASC/DESC) |
| favorites | PK `(user_id, bull_id)`, `user_id`, `bull_id` |

---

## 7. Column Name Mapping (Spanish → English)

For reference when mapping seed/API data or existing code:

| Spanish (UI) | English (schema) |
|-------------------|------------------|
| caravana          | ear_tag          |
| nombre            | name             |
| uso               | use_type         |
| origen            | origin           |
| pelaje            | coat             |
| raza              | breed            |
| edad_meses        | age_months       |
| caracteristica_destacada | standout_feature |
| crecimiento       | growth           |
| facilidad_parto   | calving_ease     |
| reproduccion      | reproduction     |
| moderacion        | moderation       |
| carcasa           | carcass          |

---

## 8. Example Query (listing with filters and favorites)

```sql
SELECT b.*,
       EXISTS (
         SELECT 1 FROM favorites f
         WHERE f.bull_id = b.id AND f.user_id = $1
       ) AS is_favorite
FROM bulls b
WHERE ($2::text IS NULL OR LOWER(b.ear_tag) LIKE '%' || LOWER($2) || '%' OR LOWER(b.name) LIKE '%' || LOWER($2) || '%')
  AND ($3::origin_type IS NULL OR b.origin = $3)
  AND ($4::coat_type IS NULL OR b.coat = $4)
  AND ($5::boolean IS NULL OR (b.use_type = 'vaquillona') = $5)
  AND ($6::boolean IS NULL OR EXISTS (SELECT 1 FROM favorites f WHERE f.bull_id = b.id AND f.user_id = $1))
ORDER BY b.bull_score DESC
LIMIT $7 OFFSET $8;
```

Parameters: `$1` = user_id, `$2` = search, `$3` = origin, `$4` = coat, `$5` = for_heifer (use_type filter), `$6` = favorites_only, `$7` = limit, `$8` = offset.
