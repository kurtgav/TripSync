import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL && process.env.NODE_ENV !== 'development') {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const connectionString = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/tripsync';
export const pool = new Pool({ connectionString });
export const db = drizzle({ client: pool, schema });
