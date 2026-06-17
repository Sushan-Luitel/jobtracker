import { query } from './pool';
import dotenv from 'dotenv';

dotenv.config();

const migration = `
  CREATE EXTENSION IF NOT EXISTS "pgcrypto";

  CREATE TYPE job_type_enum AS ENUM ('Internship', 'Full-time', 'Part-time');
  CREATE TYPE status_enum AS ENUM ('Applied', 'Interviewing', 'Offer', 'Rejected');

  CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(255) NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    job_type job_type_enum NOT NULL,
    status status_enum NOT NULL DEFAULT 'Applied',
    applied_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ language 'plpgsql';

  DROP TRIGGER IF EXISTS update_applications_updated_at ON applications;

  CREATE TRIGGER update_applications_updated_at
    BEFORE UPDATE ON applications
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

  CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
  CREATE INDEX IF NOT EXISTS idx_applications_applied_date ON applications(applied_date DESC);
  CREATE INDEX IF NOT EXISTS idx_applications_company_name ON applications USING gin(to_tsvector('english', company_name));
`;

async function migrate(): Promise<void> {
  console.log('Running migrations...');
  try {
    await query(migration);
    console.log('✅ Migrations complete');
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

migrate();
