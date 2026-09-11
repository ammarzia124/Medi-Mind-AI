# MediMind AI - Database

## Overview

This directory contains database schemas, migrations, seed scripts, and database-specific logic.

## Structure

```
database/
├── migrations/       # Database migration files
├── seeds/            # Seed data scripts
├── schemas/          # Database schema definitions
├── functions/        # Database functions and stored procedures
└── backups/          # Backup scripts
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  language_preference VARCHAR(2) DEFAULT 'en',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Timeline Entries Table
```sql
CREATE TABLE timeline_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  severity VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Symptom Analyses Table
```sql
CREATE TABLE symptom_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  input_text TEXT NOT NULL,
  result JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Lab Analyses Table
```sql
CREATE TABLE lab_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  input_text TEXT NOT NULL,
  result JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Migrations

Run migrations:
```bash
npm run migrate
```

## Seeds

Run seed data:
```bash
npm run seed
```

## Technology

- PostgreSQL 15+
- Prisma ORM (optional)
- pg-migrate for migrations
