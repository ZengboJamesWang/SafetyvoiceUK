-- SafetyVoice UK — PostgreSQL schema
-- Run once: psql -U svadmin -d safetyvoice -f schema.sql

CREATE TABLE IF NOT EXISTS submissions (
  id               VARCHAR(50)  PRIMARY KEY,
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  status           TEXT         NOT NULL DEFAULT 'private',
  role             VARCHAR(100),
  institution_type VARCHAR(100),
  region           VARCHAR(100),
  discipline       VARCHAR(100),
  time_window      VARCHAR(100),
  what_happened    TEXT,
  impact           TEXT,
  improvement      TEXT,
  consent_publish  BOOLEAN      NOT NULL DEFAULT FALSE,
  contact_name     VARCHAR(100),
  contact_email    VARCHAR(255),
  publish_title    VARCHAR(255),
  publish_summary  TEXT,
  publish_story    TEXT,
  anonymisation_notes TEXT,
  risk_flags       TEXT,
  confidence       VARCHAR(20),
  published_at     TIMESTAMPTZ,
  admin_notes      TEXT
);
