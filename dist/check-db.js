"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const drizzle_orm_1 = require("drizzle-orm");
async function applyChanges() {
    try {
        console.log('Adding username column...');
        await db_1.db.execute((0, drizzle_orm_1.sql) `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "username" varchar(255) UNIQUE;`);
        console.log('Creating portfolios table...');
        await db_1.db.execute((0, drizzle_orm_1.sql) `
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
        await db_1.db.execute((0, drizzle_orm_1.sql) `
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
    }
    catch (error) {
        console.error('Error updating schema:', error);
        process.exit(1);
    }
}
applyChanges();
