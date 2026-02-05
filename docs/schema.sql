-- =============================================================================
-- Bulltrack Pro — PostgreSQL Schema
-- Run this file to create ENUMs, tables, and indexes. Column names are in English.
-- Re-runnable: drops existing objects first (in correct order).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Drop existing objects (reverse dependency order)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS bulls;
DROP TABLE IF EXISTS users;
DROP TYPE IF EXISTS coat_type;
DROP TYPE IF EXISTS origin_type;
DROP TYPE IF EXISTS use_type;

-- -----------------------------------------------------------------------------
-- 2. ENUMs (domain values)
-- -----------------------------------------------------------------------------
CREATE TYPE use_type AS ENUM ('vaquillona', 'vaca');
CREATE TYPE origin_type AS ENUM ('propio', 'catalogo');
CREATE TYPE coat_type AS ENUM ('negro', 'colorado');

-- -----------------------------------------------------------------------------
-- 3. Table: users
-- -----------------------------------------------------------------------------
CREATE TABLE users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      VARCHAR(255) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  name       VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_email ON users (email);

-- -----------------------------------------------------------------------------
-- 4. Table: bulls
-- -----------------------------------------------------------------------------
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

-- -----------------------------------------------------------------------------
-- 5. Table: favorites
-- -----------------------------------------------------------------------------
CREATE TABLE favorites (
  user_id    UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  bull_id    BIGINT NOT NULL REFERENCES bulls (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, bull_id)
);

CREATE INDEX idx_favorites_user_id ON favorites (user_id);
CREATE INDEX idx_favorites_bull_id ON favorites (bull_id);
