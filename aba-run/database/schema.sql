CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS radio_stations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  frequency TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Aba',
  stream_url TEXT,
  logo_url TEXT,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS billboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone TEXT NOT NULL,
  title TEXT NOT NULL,
  image_url TEXT,
  target_url TEXT,
  campaign TEXT,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES players(id) ON DELETE SET NULL,
  score INT NOT NULL DEFAULT 0 CHECK(score >= 0),
  cash INT NOT NULL DEFAULT 0 CHECK(cash >= 0),
  distance NUMERIC(10,2) NOT NULL DEFAULT 0,
  zone TEXT,
  vehicle TEXT NOT NULL DEFAULT 'keke',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  reward INT NOT NULL DEFAULT 0,
  enabled BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS game_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS runs_score_idx ON runs(score DESC);
CREATE INDEX IF NOT EXISTS billboards_zone_idx ON billboards(zone, enabled);
CREATE INDEX IF NOT EXISTS radio_enabled_idx ON radio_stations(enabled, sort_order);
