# MediMind AI - Backend

## Overview

This directory contains the backend services for MediMind AI.

## Structure

```
backend/
├── api/              # API route handlers
├── services/         # Business logic services
├── models/           # Data models
├── middleware/        # Authentication, validation middleware
├── utils/            # Backend utilities
├── config/           # Configuration files
└── tests/            # Backend tests
```

## API Endpoints

### Health Analysis
- `POST /api/symptoms/analyze` - Analyze symptoms
- `POST /api/lab/analyze` - Analyze lab reports

### User Management
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/user/profile` - Get user profile

### Timeline
- `GET /api/timeline` - Get timeline entries
- `POST /api/timeline` - Add timeline entry
- `DELETE /api/timeline/:id` - Delete timeline entry

## Technology Stack

- Node.js / Express
- TypeScript
- PostgreSQL
- Redis (caching)
- JWT Authentication

## Setup

```bash
cd backend
npm install
npm run dev
```

## Environment Variables

See `.env.example` for required environment variables.
