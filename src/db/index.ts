import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import dotenv from 'dotenv';

import * as schema from '../models';

dotenv.config();

const pool = new Pool({
  user: "avnadmin",
  password: process.env.DB_PASSWORD,
  host: "pg-e93faa3-codegeass1933-4f09.h.aivencloud.com",
  port: 27894,
  database: "defaultdb",
  ssl: {
    rejectUnauthorized: true,
    ca: process.env.DB_CA_CERT, // simpan di env
  },
});



export const db = drizzle(pool, { schema });