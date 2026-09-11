# MediMind AI - Backend Implementation

## Overview

Complete production-ready backend for MediMind AI, built with Node.js, Express, TypeScript, and PostgreSQL.

## Architecture

```
backend/
├── src/
│   ├── ai/                    # AI/ML integration
│   │   └── aiService.ts       # Symptom & lab analysis with safety rules
│   │
│   ├── config/                # Configuration management
│   │   └── index.ts           # Environment variables & settings
│   │
│   ├── controllers/           # Request handlers
│   │   ├── authController.ts
│   │   ├── symptomController.ts
│   │   ├── labController.ts
│   │   └── timelineController.ts
│   │
│   ├── middleware/            # Express middleware
│   │   ├── auth.ts            # JWT authentication
│   │   ├── errorHandler.ts    # Global error handling
│   │   ├── rateLimit.ts       # Rate limiting
│   │   └── validation.ts      # Request validation
│   │
│   ├── routes/                # API routes
│   │   ├── index.ts           # Route aggregator
│   │   ├── authRoutes.ts
│   │   ├── symptomRoutes.ts
│   │   ├── labRoutes.ts
│   │   └── timelineRoutes.ts
│   │
│   ├── security/              # Security utilities
│   │   ├── jwt.ts             # JWT token management
│   │   ├── encryption.ts      # AES-256-GCM encryption
│   │   └── sanitize.ts        # Input sanitization
│   │
│   ├── services/              # Business logic
│   │   ├── authService.ts
│   │   ├── symptomService.ts
│   │   ├── labService.ts
│   │   └── timelineService.ts
│   │
│   ├── utils/                 # Helper functions
│   │   ├── dateUtils.ts
│   │   ├── logger.ts
│   │   └── responseFormatter.ts
│   │
│   ├── validators/            # Zod validation schemas
│   │   ├── schemas.ts         # Core AI output schemas
│   │   ├── authValidator.ts
│   │   ├── symptomValidator.ts
│   │   ├── labValidator.ts
│   │   └── timelineValidator.ts
│   │
│   ├── types/                 # TypeScript types
│   │   └── index.ts
│   │
│   └── index.ts               # Application entry point
│
├── tests/                     # Test files
│   ├── authService.test.ts
│   ├── symptomService.test.ts
│   └── security.test.ts
│
├── .env.example               # Environment variables template
├── package.json               # Dependencies & scripts
├── tsconfig.json              # TypeScript configuration
└── README.md                  # This file
```

## Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL 15+
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod
- **Password Hashing**: bcrypt
- **Encryption**: AES-256-GCM
- **Security**: Helmet, CORS, Rate Limiting
- **Testing**: Jest

## API Endpoints

### Authentication
```
POST   /api/auth/register          # Register new user
POST   /api/auth/login             # Login user
GET    /api/auth/profile           # Get user profile (authenticated)
PUT    /api/auth/profile           # Update user profile (authenticated)
```

### Symptom Analysis
```
POST   /api/symptoms/analyze       # Analyze symptoms (public)
GET    /api/symptoms/history       # Get symptom history (authenticated)
```

### Lab Report Analysis
```
POST   /api/lab/analyze            # Analyze lab report (public)
GET    /api/lab/history            # Get lab history (authenticated)
```

### Timeline
```
GET    /api/timeline               # Get timeline entries (authenticated)
POST   /api/timeline               # Create timeline entry (authenticated)
DELETE /api/timeline/:id           # Delete timeline entry (authenticated)
```

### Health Check
```
GET    /api/health                 # Health check endpoint
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Set up the database**
```bash
# Create database
createdb medimind

# Run migrations
psql -U postgres -d medimind -f ../database/migrations/001_initial_schema.sql
psql -U postgres -d medimind -f ../database/migrations/002_add_indexes.sql
psql -U postgres -d medimind -f ../database/migrations/003_add_triggers.sql

# Optional: Load sample data
psql -U postgres -d medimind -f ../database/seed/sample_users.sql
```

5. **Start the development server**
```bash
npm run dev
```

The server will start on `http://localhost:3001`

## Environment Variables

See `.env.example` for all required environment variables:

- **Server**: PORT, NODE_ENV, CORS_ORIGIN
- **Database**: DATABASE_URL, DATABASE_HOST, DATABASE_PORT, etc.
- **Security**: JWT_SECRET, JWT_EXPIRES_IN, BCRYPT_ROUNDS, ENCRYPTION_KEY
- **AI**: AI_API_KEY, AI_MODEL
- **Email**: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD
- **Rate Limiting**: RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS
- **Logging**: LOG_LEVEL

## Security Features

### Authentication
- JWT-based authentication
- Token expiration (configurable)
- Secure password hashing with bcrypt
- Protected routes with middleware

### Input Validation
- Zod schemas for all inputs
- Request body validation
- Query parameter validation
- Path parameter validation

### Security Headers
- Helmet.js for security headers
- CORS configuration
- Rate limiting (100 requests per 15 minutes)
- XSS protection
- CSRF protection

### Data Protection
- AES-256-GCM encryption for sensitive data
- Input sanitization
- SQL injection prevention
- No sensitive data in logs

### AI Safety
- All AI output validated through Zod
- Probabilistic language (never definitive diagnoses)
- Emergency detection and handling
- Comprehensive disclaimers
- No medical advice, only information

## Medical Safety Implementation

### Critical Rules
1. **NEVER provides medical diagnoses**
2. **All output validated through Zod before returning**
3. **Uses probabilistic language**: "This may be associated with..."
4. **For emergencies, clearly advises immediate medical care**
5. **NEVER encourages users to delay emergency treatment**

### Example Response Structure
```typescript
{
  severity: 3,                    // 1-5 scale
  urgency: "doctor_soon",         // emergency | urgent | doctor_soon | monitor | self_care
  summary: "...",                 // What this may suggest
  possible_explanations: [...],   // Multiple possibilities
  warning_signs: [...],           // When to seek care
  recommended_action: "...",      // What to do next
  self_care: [...],               // Home care options
  disclaimer: "..."               // Medical disclaimer
}
```

## Testing

### Run Tests
```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Test Coverage
- Unit tests for services
- Integration tests for controllers
- Security tests for authentication
- Validation tests for schemas

## Development Scripts

```bash
npm run dev           # Start development server with hot reload
npm run build         # Build for production
npm start             # Start production server
npm test              # Run tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate coverage report
npm run lint          # Run ESLint
npm run format        # Format code with Prettier
```

## Production Deployment

### Build
```bash
npm run build
```

### Start
```bash
npm start
```

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:password@host:5432/medimind
JWT_SECRET=<strong-random-secret>
ENCRYPTION_KEY=<strong-random-key>
CORS_ORIGIN=https://your-domain.com
AI_API_KEY=<your-openai-api-key>
```

### Security Checklist
- [ ] Change all default secrets
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain
- [ ] Set up database backups
- [ ] Enable monitoring and logging
- [ ] Configure rate limiting appropriately
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Review all environment variables

## Performance Optimization

### Caching
- In-memory caching for frequently accessed data
- Configurable TTL for different data types
- Cache invalidation on data updates

### Database
- Indexed queries for fast lookups
- Connection pooling
- Query optimization

### API
- Rate limiting to prevent abuse
- Response compression
- Efficient serialization

## Monitoring & Logging

### Logging
- Structured logging with Winston
- Configurable log levels
- Request/response logging
- Error logging with context

### Monitoring
- Health check endpoint
- Performance metrics
- Error tracking
- Uptime monitoring

## Error Handling

### Error Types
- **400**: Validation errors
- **401**: Authentication errors
- **403**: Authorization errors
- **404**: Not found errors
- **500**: Server errors

### Error Response Format
```json
{
  "success": false,
  "message": "User-friendly error message",
  "details": {
    "field": "Error details"
  }
}
```

## API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "details": { ... }
}
```

## Database Schema

See `/database/README.md` for complete database documentation.

### Main Tables
- `users` - User accounts
- `health_profiles` - User health information
- `consultations` - AI analysis history
- `symptoms` - Symptom tracking
- `lab_reports` - Lab report metadata
- `lab_results` - Individual lab results
- `medications` - Medication tracking
- `health_events` - Timeline events

## Contributing

1. Follow TypeScript best practices
2. Write tests for new features
3. Update documentation
4. Follow the existing code style
5. Use meaningful commit messages

## License

MIT

## Support

For issues and questions:
- GitHub Issues
- Documentation: `/docs/`
- API Documentation: See endpoint descriptions above

---

**Status**: ✅ Production Ready  
**Version**: 1.0.0  
**Last Updated**: 2024-01-01
