import { defineConfig } from "drizzle-kit";
import "dotenv/config";
import { X509Certificate } from "crypto";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

const caCertificate = process.env.DB_CA_CERT?.replace(/\\n/g, "\n");
const connectionString = new URL(process.env.DATABASE_URL);
connectionString.searchParams.delete("sslmode");
connectionString.searchParams.delete("sslrootcert");

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

export default defineConfig({
  schema: "./src/models/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString.toString(),
    ssl: isValidCertificate(caCertificate)
      ? {
          rejectUnauthorized: true,
          ca: caCertificate,
        }
      : {
          rejectUnauthorized: false,
        },
  },
});
