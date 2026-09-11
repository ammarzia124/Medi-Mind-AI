# MediMind AI - Backend

## Overview

Production-grade backend services for MediMind AI, built with Node.js, Express, and TypeScript.

## Architecture

```
backend/
├── src/
│   ├── controllers/      # Request handlers
│   │   ├── authController.ts
│   │   ├── symptomController.ts
│   │   ├── labController.ts
│   │   └── timelineController.ts
│   │
│   ├── routes/           # Route definitions
│   │   ├── index.ts
│   │   ├── authRoutes.ts
│   │   ├── symptomRoutes.ts
│   │   ├── labRoutes.ts
│   │   └── timelineRoutes.ts
│   │
│   ├── services/         # Business logic
│   │   ├── authService.ts
│   │   ├── symptomService.ts
│   │   ├── labService.ts
│   │   └── timelineService.ts
│   │
│   ├── middleware/        # Express middleware
│   │   ├── auth.ts           # JWT authentication
│   │   ├── errorHandler.ts   # Error handling
│   │   ├── validation.ts     # Request validation
│   │   └── rateLimit.ts      # Rate limiting
│   │
│   ├── validators/       # Zod validation schemas
│   │   ├── authValidator.ts
│   │   ├── symptomValidator.ts
│   │   ├── labValidator.ts
│   │   └── timelineValidator.ts
│   │
│   ├── ai/               # AI/ML integration
│   │   └── aiService.ts
│   │
│   ├── security/         # Security utilities
│   │   ├── jwt.ts            # JWT token management
│   │   ├── encryption.ts     # Data encryption
│   │   └── sanitize.ts       # Input sanitization
│   │
│   ├── utils/            # Helper functions
│   │   ├── dateUtils.ts
│   │   ├── logger.ts
│   │   └── responseFormatter.ts
│   │
│   ├── config/           # Configuration
│   │   └── index.ts
│   │
│   └── types/            # TypeScript types
│       └── index.ts
│
├── tests/                # Test files
│   ├── authService.test.ts
│   ├── symptomService.test.ts
│   └── security.test.ts
│
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (authenticated)
- `PUT /api/auth/profile` - Update user profile (authenticated)

### Symptoms
- `POST /api/symptoms/analyze` - Analyze symptoms
- `GET /api/symptoms/history` - Get symptom analysis history (authenticated)

### Lab Reports
- `POST /api/lab/analyze` - Analyze lab report
- `GET /api/lab/history` - Get lab analysis history (authenticated)

### Timeline
- `GET /api/timeline` - Get timeline entries (authenticated)
- `POST /api/timeline` - Create timeline entry (authenticated)
- `DELETE /api/timeline/:id` - Delete timeline entry (authenticated)

### Health Check
- `GET /api/health` - Health check endpoint

## Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Validation**: Zod
- **Security**: Helmet, bcryptjs, encryption
- **Testing**: Jest

## Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- npm or yarn

### Installation

```bash
cd backend
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `ENCRYPTION_KEY` - Key for data encryption
- `AI_API_KEY` - AI service API key (optional)

### Development

```bash
npm run dev
```

Server will start on `http://localhost:3001`

### Build

```bash
npm run build
npm start
```

### Testing

```bash
npm test
npm run test:watch
npm run test:coverage
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with configurable rounds
- **Data Encryption**: AES-256-GCM for sensitive data
- **Input Sanitization**: XSS and SQL injection prevention
- **Rate Limiting**: Protection against abuse
- **Helmet**: Security headers
- **CORS**: Configurable cross-origin support

## Database Integration

The backend is designed to work with PostgreSQL. Database schemas are in the `/database` directory.

To integrate:
1. Run database migrations
2. Configure `DATABASE_URL` in `.env`
3. Implement database queries in services (marked with TODO comments)

## AI Integration

The AI service layer (`src/ai/aiService.ts`) currently uses rule-based analysis. To integrate with actual AI models:

1. Configure `AI_API_KEY` in `.env`
2. Implement API calls in `aiService.ts`
3. Support for OpenAI GPT-4, custom models, etc.

## Error Handling

All errors are handled by the centralized error handler middleware:
- Validation errors (Zod)
- Authentication errors (JWT)
- Database errors
- Custom application errors

## Logging

Structured logging with configurable levels:
- debug
- info
- warn
- error

Set `LOG_LEVEL` in `.env` to control verbosity.

## Deployment

### Production Checklist
- [ ] Set strong `JWT_SECRET`
- [ ] Set strong `ENCRYPTION_KEY`
- [ ] Configure production database
- [ ] Enable HTTPS
- [ ] Set up monitoring
- [ ] Configure rate limiting
- [ ] Enable error tracking (Sentry, etc.)
- [ ] Set up backups

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://...
JWT_SECRET=<strong-random-secret>
ENCRYPTION_KEY=<strong-random-key>
CORS_ORIGIN=https://your-domain.com
```

## License

MIT
