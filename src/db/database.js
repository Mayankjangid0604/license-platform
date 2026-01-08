import Database from "better-sqlite3";

export const db = new Database("license.db");

db.exec(`
CREATE TABLE IF NOT EXISTS apps (
  app_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS licenses (
  license_key TEXT PRIMARY KEY,
  app_id TEXT NOT NULL,
  status TEXT NOT NULL,
  expires_at TEXT,
  last_validated_at TEXT,     -- NEW
  created_at TEXT NOT NULL,
  FOREIGN KEY (app_id) REFERENCES apps(app_id)
);

CREATE TABLE IF NOT EXISTS machines (
  license_key TEXT PRIMARY KEY,
  machine_id TEXT NOT NULL,
  bound_at TEXT NOT NULL,
  FOREIGN KEY (license_key) REFERENCES licenses(license_key)
);
`);
