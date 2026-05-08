// This file is kept for drizzle-kit CLI tooling (migrations, schema push).
// Application DB connections are handled inside each adapter in server/adapters/.

import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const connectionString = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("No database connection string found. Set SUPABASE_DATABASE_URL or DATABASE_URL.");
}

const useSSL = !!process.env.SUPABASE_DATABASE_URL;

export const pool = new pg.Pool({
  connectionString,
  ssl: useSSL ? { rejectUnauthorized: false } : false,
});

export const db = drizzle(pool, { schema });
