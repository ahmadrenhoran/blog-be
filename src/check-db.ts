import { db } from './db';
import { sql } from 'drizzle-orm';

async function applyChanges() {
  try {
    console.log('Adding username column...');
    await db.execute(sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "username" varchar(255) UNIQUE;`);
    
    console.log('Creating portfolios table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "portfolios" (
        "id" serial PRIMARY KEY,
        "user_id" integer NOT NULL REFERENCES "users"("id"),
        "title" varchar(255),
        "description" jsonb,
        "image_url" varchar(255),
        "tech_stack" text[],
        "demo_url" varchar(255),
        "repo_url" varchar(255),
        "is_featured" boolean DEFAULT false,
        "updated_at" timestamp DEFAULT now() NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL
      );
    `);

    console.log('Creating resumes table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "resumes" (
        "id" serial PRIMARY KEY,
        "user_id" integer NOT NULL REFERENCES "users"("id"),
        "file_url" varchar(255),
        "file_name" varchar(255),
        "is_primary" boolean DEFAULT false,
        "uploaded_at" timestamp DEFAULT now() NOT NULL
      );
    `);

    console.log('Schema updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating schema:', error);
    process.exit(1);
  }
}

applyChanges();
