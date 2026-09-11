# MediMind AI - Database Layer

## Overview

Complete production-ready database layer for MediMind AI, built with PostgreSQL and TypeScript.

## Architecture

```
database/
├── src/
│   ├── config/                    # Configuration
│   ├── client/                    # Database client with connection pooling
│   ├── types/                     # TypeScript type definitions
│   ├── repositories/              # Data access layer (5 repositories)
│   ├── migrations/                # Migration runner
│   ├── seed/                      # Seed runner
│   └── utils/                     # Utilities
├── schemas/                       # SQL schema files (8 tables)
├── migrations/                    # Migration SQL files (3 migrations)
├── seed/                          # Seed SQL files (3 seed files)
└── indexes/                       # Index definitions
```

## Features

### Database Client
- ✅ Connection pooling (configurable max connections)
- ✅ Transaction support
- ✅ Query logging and monitoring
- ✅ Health check endpoint
- ✅ Pool statistics

### Repository Pattern
- ✅ User Repository
- ✅ Consultation Repository
- ✅ Symptom Repository
- ✅ Medication Repository
- ✅ Health Event Repository

### Migration System
- ✅ Automatic migration tracking
- ✅ Up/down migration support
- ✅ SQL-based migrations
- ✅ Idempotent migrations

### Seed System
- ✅ Sample data loading
- ✅ Development data
- ✅ Test data support

### Type Safety
- ✅ Full TypeScript coverage
- ✅ Type-safe queries
- ✅ Interface definitions for all entities
- ✅ Generic pagination support

## Database Schema

### Tables (8 Total)

1. **users** - User accounts and authentication
2. **health_profiles** - User health information
3. **consultations** - AI analysis history
4. **symptoms** - Symptom tracking
5. **lab_reports** - Lab report metadata
6. **lab_results** - Individual lab results
7. **medications** - Medication tracking
8. **health_events** - Timeline events

### Key Features
- UUID primary keys
- Foreign key constraints with cascade deletes
- JSONB for flexible data storage
- Automatic timestamp triggers
- Comprehensive indexing

## Setup

### Prerequisites
- PostgreSQL 15+
- Node.js 18+

### Installation
```bash
cd database
npm install
```

### Configuration
```bash
cp .env.example .env
# Edit .env with your database credentials
```

### Database Setup
```bash
# Create database
createdb medimind

# Run migrations
npm run migrate:up

# Load sample data (optional)
npm run seed
```

## Usage

### Import and Use
```typescript
import { 
  db, 
  userRepository, 
  consultationRepository,
  symptomRepository,
  medicationRepository,
  healthEventRepository
} from './src';

// Check connection
const isHealthy = await db.healthCheck();

// Create user
const user = await userRepository.create({
  email: 'user@example.com',
  password_hash: 'hashed_password',
  language_preference: 'en',
});

// Create consultation
const consultation = await consultationRepository.create({
  user_id: user.id,
  type: 'symptom',
  user_input: 'I have a headache',
  ai_response: { severity: 2, urgency: 'self_care' },
});

// List with pagination
const result = await consultationRepository.listByUser(user.id, {
  page: 1,
  limit: 20,
  type: 'symptom',
});
```

### Transactions
```typescript
await db.transaction(async (client) => {
  await client.query('INSERT INTO users ...');
  await client.query('INSERT INTO health_profiles ...');
});
```

## Scripts

```bash
npm run build          # Build TypeScript
npm run migrate:up     # Run migrations
npm run migrate:down   # Rollback last migration
npm run seed           # Load sample data
npm test               # Run tests
```

## Security

- ✅ Parameterized queries (SQL injection prevention)
- ✅ Foreign key constraints
- ✅ Soft deletes
- ✅ Input validation
- ✅ No sensitive data in logs
- ✅ Encrypted connections support

## Performance

- ✅ Connection pooling
- ✅ Comprehensive indexing
- ✅ Query optimization
- ✅ Efficient joins
- ✅ Pagination support

## Monitoring

```typescript
// Query logging
// All queries logged with duration, row count, and errors

// Pool statistics
const stats = db.getPoolStats();
// { totalCount: 20, idleCount: 15, waitingCount: 0 }

// Health check
const isHealthy = await db.healthCheck();
```

## Documentation

- [Complete Architecture Guide](../docs/DATABASE_COMPLETE_ARCHITECTURE.md)
- [Schema Documentation](./schemas/)
- [Migration Guide](./migrations/)

## Status

✅ **COMPLETE AND PRODUCTION READY**

- Total Tables: 8
- Total Repositories: 5
- Total Migrations: 3
- Total Indexes: 20+
- Full TypeScript coverage
- Connection pooling
- Transaction support
- Migration system
- Seed system

---

**Version**: 1.0.0  
**Last Updated**: 2024-01-01
