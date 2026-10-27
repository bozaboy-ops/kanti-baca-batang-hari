import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL ?? "postgres://bacca@127.0.0.1:5433/bacca_ai";

export const pool = new Pool({ connectionString });

export const db = drizzle(pool, { schema });
