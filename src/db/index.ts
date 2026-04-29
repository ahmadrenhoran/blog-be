import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { X509Certificate } from 'crypto';

import * as schema from '../models';

dotenv.config({ quiet: true });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required');
}

const caCertificate = process.env.DB_CA_CERT?.replace(/\\n/g, '\n');
const connectionString = new URL(databaseUrl);
connectionString.searchParams.delete('sslmode');
connectionString.searchParams.delete('sslrootcert');

const isValidCertificate = (certificate: string | undefined) => {
  if (!certificate) {
    return false;
  }

  try {
    new X509Certificate(certificate);
    return true;
  } catch {
    return false;
  }
};

const ssl = isValidCertificate(caCertificate)
  ? {
      rejectUnauthorized: true,
      ca: caCertificate,
    }
  : {
      rejectUnauthorized: false,
    };

export const pool = new Pool({
  connectionString: connectionString.toString(),
  ssl,
});

export const db = drizzle(pool, { schema });

export const assertDbConnection = async () => {
  const client = await pool.connect();

  try {
    await client.query('select 1');
  } finally {
    client.release();
  }
};
