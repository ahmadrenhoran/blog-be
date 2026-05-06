---
title: Backend API
emoji: 🚀
colorFrom: blue
colorTo: green
sdk: docker
pinned: false
---

# ⚙️ Portfolio Management - Headless API

The core backend for the Portfolio Management System. This is a high-performance REST API designed to serve both the Creator Workspace (CMS) and public-facing portfolio websites.

## 🚀 Features

- **Authentication**: JWT-based login and registration.
- **Headless CMS Engine**: CRUD for blogs and portfolios.
- **Dynamic Public Endpoints**: Publicly accessible data based on custom usernames.
- **Localization (i18n)**: Support for multi-language project descriptions.
- **Document Management**: Secure file upload for CVs and Resumes via Hugging Face/S3 integration.
- **AI Integration**: Service layer for AI-powered writing assistance.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js (v5)
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Validation**: Zod
- **File Handling**: Multer

## 📡 API Endpoints (Quick Reference)

### 🔓 Public Endpoints (`/api/v1/public/:username`)
- `GET /portfolio`: Get all projects (supports `?lang=id|en`).
- `GET /cv`: Get the primary/latest resume.
- `GET /blog`: Get all published blog posts.
- `GET /blog/:slug`: Get blog post details.

### 🔐 Private Endpoints (Requires Auth)
- `PATCH /user/profile`: Update name and unique username.
- `GET/POST/PATCH/DELETE /portfolios`: Manage projects.
- `POST /resumes/upload`: Upload new document.
- `POST /ai/writing`: AI Writing Assistant engine.

## 🛠️ Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Setup Environment**:
    Create a `.env` file based on `.env.template`:
    ```env
    DATABASE_URL=your_postgres_url
    JWT_SECRET=your_secret
    HF_TOKEN=your_huggingface_token
    ```
3.  **Database Migration**:
    ```bash
    npm run db:push
    ```
4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## 🏗️ Architecture
The project follows a **Controller-Service-Model** pattern:
- **Models**: Database schema definitions using Drizzle.
- **Services**: Business logic and database operations.
- **Controllers**: Express request/response handling.
- **Routes**: API endpoint definitions.
- **Schemas**: Zod validation rules.
