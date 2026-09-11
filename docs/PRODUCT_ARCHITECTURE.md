# MediMind AI — Product Architecture

**Version:** 1.0.0  
**Last Updated:** 2024-01-01  
**Status:** Production Architecture

---

## Table of Contents

1. [Feature Map](#1-feature-map)
2. [User Journeys](#2-user-journeys)
3. [Information Architecture](#3-information-architecture)
4. [Frontend Architecture](#4-frontend-architecture)
5. [Backend Architecture](#5-backend-architecture)
6. [Database Architecture](#6-database-architecture)
7. [AI Architecture](#7-ai-architecture)
8. [API Architecture](#8-api-architecture)
9. [Authentication Architecture](#9-authentication-architecture)
10. [Security Architecture](#10-security-architecture)
11. [Error-Handling Strategy](#11-error-handling-strategy)
12. [Loading-State Strategy](#12-loading-state-strategy)
13. [Empty-State Strategy](#13-empty-state-strategy)
14. [Mobile Architecture](#14-mobile-architecture)
15. [Accessibility Strategy](#15-accessibility-strategy)

---

## 1. Feature Map

### Core Features

```
MediMind AI
│
├── 🔐 Authentication
│   ├── Register
│   ├── Login
│   ├── Logout
│   └── Password Reset
│
├── 🏠 Dashboard
│   ├── Quick Actions
│   ├── Recent Activity
│   ├── Health Summary
│   └── Reminders
│
├── 🩺 Symptom Triage
│   ├── Symptom Input
│   ├── AI Analysis
│   ├── Severity Assessment
│   ├── Possible Causes
│   ├── Warning Signs
│   └── Care Navigation
│
├── 🧪 Lab Report Reader
│   ├── Upload Report
│   ├── Manual Input
│   ├── AI Interpretation
│   ├── Result Explanation
│   └── Next Steps
│
├── 💊 Medication Safety
│   ├── Medication Lookup
│   ├── Interaction Check
│   ├── Side Effects
│   ├── Dosage Info
│   └── Safety Warnings
│
├── 📅 Health Timeline
│   ├── Symptom History
│   ├── Lab Results
│   ├── Medications
│   ├── Appointments
│   └── Notes
│
├── 👤 Health Profile
│   ├── Personal Info
│   ├── Medical History
│   ├── Allergies
│   ├── Current Medications
│   └── Preferences
│
└── 🌍 Localization
    ├── English (LTR)
    ├── Urdu (RTL)
    └── Language Switcher
```

### Feature Priority

**P0 - Must Have (MVP)**
- Authentication
- Symptom Triage
- Lab Report Reader
- Health Timeline
- English/Urdu support

**P1 - Should Have**
- Dashboard
- Health Profile
- Medication Safety

**P2 - Nice to Have**
- Push notifications
- Export data
- Share with doctor
- Appointment scheduling

---

## 2. User Journeys

### Journey 1: Symptom Check (Primary)

```
User opens app
    ↓
Sees dashboard with "Check Symptoms" CTA
    ↓
Taps "Check Symptoms"
    ↓
Enters symptoms: "I have a headache and feel tired"
    ↓
AI analyzes (1-2 seconds)
    ↓
Shows results:
  • Severity: Low (🟢)
  • Possible causes: Stress, dehydration, lack of sleep
  • Warning signs: Severe headache, vision changes
  • Recommended: Rest, hydrate, monitor
    ↓
User taps "Add to Timeline"
    ↓
Entry saved to health timeline
    ↓
User returns to dashboard
```

### Journey 2: Lab Report Analysis

```
User receives lab results
    ↓
Opens MediMind → "Analyze Lab Report"
    ↓
Uploads PDF or enters values manually
    ↓
AI interprets results (2-3 seconds)
    ↓
Shows explanation:
  • Hemoglobin: 12.5 g/dL (Normal ✅)
  • What it means: "Your oxygen-carrying capacity is good"
  • Next steps: "Continue balanced diet"
    ↓
User saves to timeline
    ↓
Gets recommendation: "Discuss with doctor at next visit"
```

### Journey 3: Medication Safety Check

```
User prescribed new medication
    ↓
Opens "Check Medicines"
    ↓
Searches: "Ibuprofen"
    ↓
Shows:
  • Common uses: Pain, inflammation
  • Side effects: Stomach upset, dizziness
  • Interactions: Blood thinners, aspirin
  • Safety tips: Take with food
    ↓
User checks interactions with current meds
    ↓
Gets safety assessment
```

### Journey 4: Health Timeline Review

```
User wants to track health patterns
    ↓
Opens "Health Timeline"
    ↓
Sees chronological view:
  • Today: Headache (Low severity)
  • Yesterday: Lab results (Vitamin D low)
  • Last week: Started new medication
    ↓
Taps on entry for details
    ↓
Can edit, delete, or add notes
    ↓
Exports or shares with doctor
```

---

## 3. Information Architecture

### Navigation Structure

```
┌─────────────────────────────────────┐
│  MediMind AI           [🌐 EN/UR]  │
├─────────────────────────────────────┤
│                                     │
│  [🏠 Dashboard]                    │
│  [🩺 Symptoms]                     │
│  [🧪 Lab Reports]                  │
│  [💊 Medications]                  │
│  [📅 Timeline]                     │
│  [👤 Profile]                      │
│                                     │
└─────────────────────────────────────┘
```

### Page Hierarchy

```
Level 0: App Shell
  │
  ├── Level 1: Dashboard
  │     ├── Quick Actions
  │     ├── Recent Activity
  │     └── Health Summary
  │
  ├── Level 1: Symptom Checker
  │     ├── Level 2: Input Form
  │     └── Level 2: Results View
  │           ├── Severity
  │           ├── Causes
  │           ├── Warning Signs
  │           └── Recommendations
  │
  ├── Level 1: Lab Report Analyzer
  │     ├── Level 2: Upload/Input
  │     └── Level 2: Analysis Results
  │           ├── Individual Results
  │           ├── Summary
  │           └── Next Steps
  │
  ├── Level 1: Medication Safety
  │     ├── Level 2: Search
  │     └── Level 2: Medication Details
  │           ├── Info
  │           ├── Side Effects
  │           └── Interactions
  │
  ├── Level 1: Health Timeline
  │     ├── Level 2: Timeline View
  │     └── Level 2: Entry Details
  │
  └── Level 1: Health Profile
        ├── Personal Info
        ├── Medical History
        └── Preferences
```

---

## 4. Frontend Architecture

### Technology Stack

```
Frontend
├── Framework: React 18 + TypeScript
├── Build Tool: Vite
├── Styling: Tailwind CSS
├── State Management: React Context + Hooks
├── Routing: React Router v6
├── Forms: React Hook Form + Zod
├── HTTP Client: Axios
├── Animations: Framer Motion
├── Icons: Lucide React
├── Charts: Recharts
└── i18n: Custom implementation
```

### Directory Structure

```
frontend/
├── app/
│   ├── App.tsx              # Root component
│   ├── routes.tsx           # Route definitions
│   └── providers.tsx        # Context providers
│
├── features/
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── authSlice.ts
│   │
│   ├── dashboard/
│   │   ├── DashboardPage.tsx
│   │   ├── QuickActions.tsx
│   │   └── RecentActivity.tsx
│   │
│   ├── symptoms/
│   │   ├── SymptomChecker.tsx
│   │   ├── SymptomForm.tsx
│   │   ├── SymptomResults.tsx
│   │   └── symptomService.ts
│   │
│   ├── lab/
│   │   ├── LabReport.tsx
│   │   ├── LabUpload.tsx
│   │   ├── LabResults.tsx
│   │   └── labService.ts
│   │
│   ├── medications/
│   │   ├── MedicationSafety.tsx
│   │   ├── MedicationSearch.tsx
│   │   └── medicationService.ts
│   │
│   ├── timeline/
│   │   ├── Timeline.tsx
│   │   ├── TimelineEntry.tsx
│   │   └── timelineService.ts
│   │
│   └── profile/
│       ├── HealthProfile.tsx
│       ├── PersonalInfo.tsx
│       └── profileService.ts
│
├── components/
│   ├── ui/                  # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── ...
│   │
│   ├── layout/              # Layout components
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   └── MobileNav.tsx
│   │
│   └── shared/              # Shared components
│       ├── LoadingSpinner.tsx
│       ├── ErrorMessage.tsx
│       ├── EmptyState.tsx
│       └── SeverityBadge.tsx
│
├── contexts/
│   ├── AuthContext.tsx
│   ├── LanguageContext.tsx
│   └── ThemeContext.tsx
│
├── hooks/
│   ├── useAuth.ts
│   ├── useLanguage.ts
│   ├── useApi.ts
│   └── useLocalStorage.ts
│
├── lib/
│   ├── api.ts              # API client
│   ├── validators.ts       # Zod schemas
│   ├── security.ts         # Security utilities
│   ├── performance.ts      # Performance utilities
│   └── accessibility.ts    # A11y utilities
│
├── data/
│   ├── translations.ts     # i18n translations
│   └── constants.ts        # App constants
│
├── types/
│   ├── api.ts              # API types
│   ├── models.ts           # Data models
│   └── index.ts
│
└── utils/
    ├── formatters.ts
    ├── validators.ts
    └── helpers.ts
```

### State Management

```typescript
// Global State (Context)
- AuthContext: User authentication state
- LanguageContext: Current language (en/ur)
- ThemeContext: Light/dark mode

// Feature State (Local)
- SymptomChecker: Form data, results, loading
- LabReport: Upload state, analysis results
- Timeline: Entries list, filters
- Profile: User data, edit state

// Server State (React Query / SWR)
- API responses
- Caching
- Refetching
```

### Component Patterns

```typescript
// Feature Component Pattern
function SymptomChecker() {
  const [state, setState] = useState();
  const { t } = useLanguage();
  
  return (
    <div>
      <SymptomForm onSubmit={handleSubmit} />
      {state.results && <SymptomResults data={state.results} />}
    </div>
  );
}

// Reusable UI Component Pattern
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

function Button({ variant, size, children, onClick }: ButtonProps) {
  // Implementation
}
```

---

## 5. Backend Architecture

### Technology Stack

```
Backend
├── Runtime: Node.js 18+
├── Framework: Express.js
├── Language: TypeScript
├── Database: PostgreSQL 15+
├── ORM: Prisma (optional)
├── Validation: Zod
├── Authentication: JWT
├── Password Hashing: bcrypt
├── Encryption: AES-256-GCM
├── Rate Limiting: express-rate-limit
├── Logging: Winston
└── Testing: Jest + Supertest
```

### Directory Structure

```
backend/
├── src/
│   ├── controllers/         # Request handlers
│   │   ├── authController.ts
│   │   ├── symptomController.ts
│   │   ├── labController.ts
│   │   ├── medicationController.ts
│   │   ├── timelineController.ts
│   │   └── profileController.ts
│   │
│   ├── services/            # Business logic
│   │   ├── authService.ts
│   │   ├── symptomService.ts
│   │   ├── labService.ts
│   │   ├── medicationService.ts
│   │   ├── timelineService.ts
│   │   └── profileService.ts
│   │
│   ├── routes/              # Route definitions
│   │   ├── index.ts
│   │   ├── authRoutes.ts
│   │   ├── symptomRoutes.ts
│   │   ├── labRoutes.ts
│   │   ├── medicationRoutes.ts
│   │   ├── timelineRoutes.ts
│   │   └── profileRoutes.ts
│   │
│   ├── middleware/           # Express middleware
│   │   ├── auth.ts          # JWT verification
│   │   ├── validation.ts    # Request validation
│   │   ├── rateLimit.ts     # Rate limiting
│   │   ├── errorHandler.ts  # Error handling
│   │   └── logger.ts        # Request logging
│   │
│   ├── models/              # Database models
│   │   ├── user.model.ts
│   │   ├── symptom.model.ts
│   │   ├── labReport.model.ts
│   │   ├── medication.model.ts
│   │   └── timeline.model.ts
│   │
│   ├── validators/          # Zod schemas
│   │   ├── authValidator.ts
│   │   ├── symptomValidator.ts
│   │   ├── labValidator.ts
│   │   └── ...
│   │
│   ├── ai/                  # AI integration
│   │   ├── aiService.ts     # AI client
│   │   ├── prompts.ts       # Prompt templates
│   │   └── safety.ts        # Safety filters
│   │
│   ├── security/            # Security utilities
│   │   ├── jwt.ts
│   │   ├── encryption.ts
│   │   ├── sanitize.ts
│   │   └── hash.ts
│   │
│   ├── utils/               # Helper functions
│   │   ├── logger.ts
│   │   ├── errors.ts
│   │   └── helpers.ts
│   │
│   ├── config/              # Configuration
│   │   ├── database.ts
│   │   ├── auth.ts
│   │   └── app.ts
│   │
│   └── types/               # TypeScript types
│       ├── index.ts
│       └── express.d.ts
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
└── package.json
```

### Service Layer Pattern

```typescript
// Service Pattern
class SymptomService {
  async analyzeSymptoms(userId: string, input: string) {
    // 1. Validate input
    // 2. Call AI service
    // 3. Apply safety filters
    // 4. Save to database
    // 5. Return result
  }
  
  async getSymptomHistory(userId: string) {
    // Fetch from database
  }
}

// Controller Pattern
class SymptomController {
  async analyze(req, res, next) {
    try {
      const result = await symptomService.analyzeSymptoms(
        req.user.id,
        req.body.input
      );
      res.json({ success: true,  result });
    } catch (error) {
      next(error);
    }
  }
}
```

---

## 6. Database Architecture

### Technology

```
Database: PostgreSQL 15+
Features:
- JSONB for flexible data
- Full-text search
- Indexes for performance
- Foreign key constraints
- Cascade deletes
- Automatic timestamps
```

### Schema Overview

```
┌─────────────────┐
│     users       │
├─────────────────┤
│ id (PK)         │
│ email           │
│ password_hash   │
│ language        │
│ created_at      │
└─────────────────┘
         │
         │ 1:1
         ↓
┌─────────────────┐
│ health_profiles │
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │
│ date_of_birth   │
│ gender          │
│ allergies       │
│ conditions      │
└─────────────────┘

┌─────────────────┐
│  consultations  │
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │
│ type            │
│ input           │
│ output (JSONB)  │
│ severity        │
│ created_at      │
└─────────────────┘

┌─────────────────┐
│   medications   │
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │
│ name            │
│ dosage          │
│ frequency       │
│ start_date      │
│ end_date        │
└─────────────────┘

┌─────────────────┐
│  health_events  │
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │
│ event_type      │
│ title           │
│ description     │
│ event_date      │
│ severity        │
└─────────────────┘
```

### Data Models

```typescript
// User Model
interface User {
  id: string;
  email: string;
  passwordHash: string;
  language: 'en' | 'ur';
  createdAt: Date;
  updatedAt: Date;
}

// Health Profile
interface HealthProfile {
  id: string;
  userId: string;
  dateOfBirth?: Date;
  gender?: string;
  allergies: string[];
  conditions: string[];
  currentMedications: string[];
}

// Consultation (Symptom/Lab Analysis)
interface Consultation {
  id: string;
  userId: string;
  type: 'symptom' | 'lab_report' | 'medication';
  input: string;
  output: {
    severity: number;
    urgency: string;
    summary: string;
    possible_explanations: string[];
    warning_signs: string[];
    recommended_action: string;
    self_care: string[];
    disclaimer: string;
  };
  createdAt: Date;
}

// Medication
interface Medication {
  id: string;
  userId: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
}

// Health Event (Timeline Entry)
interface HealthEvent {
  id: string;
  userId: string;
  eventType: 'symptom' | 'lab' | 'medication' | 'note' | 'appointment';
  title: string;
  description?: string;
  eventDate: Date;
  severity?: 'low' | 'moderate' | 'high';
  relatedConsultationId?: string;
  relatedMedicationId?: string;
}
```

---

## 7. AI Architecture

### AI Service Integration

```
┌──────────────────────────────────────┐
│         Frontend Request             │
└──────────────┬───────────────────────┘
               │
               ↓
┌──────────────────────────────────────┐
│      Backend AI Service Layer        │
│  ┌────────────────────────────────┐  │
│  │   Input Validation (Zod)       │  │
│  └────────────┬───────────────────┘  │
│               │                      │
│  ┌────────────▼───────────────────┐  │
│  │   Prompt Injection Detection   │  │
│  └────────────┬───────────────────┘  │
│               │                      │
│  ┌────────────▼───────────────────┐  │
│  │   Input Sanitization           │  │
│  └────────────┬───────────────────┘  │
│               │                      │
│  ┌────────────▼───────────────────┐  │
│  │   AI Model (GPT-4 / Custom)    │  │
│  └────────────┬───────────────────┘  │
│               │                      │
│  ┌────────────▼───────────────────┐  │
│  │   Output Validation (Zod)      │  │
│  └────────────┬───────────────────┘  │
│               │                      │
│  ┌────────────▼───────────────────┐  │
│  │   Safety Filters               │  │
│  └────────────┬───────────────────┘  │
│               │                      │
│  ┌────────────▼───────────────────┐  │
│  │   Fallback on Validation Fail  │  │
│  └────────────────────────────────┘  │
└──────────────┬───────────────────────┘
               │
               ↓
┌──────────────────────────────────────┐
│         Validated Response           │
└──────────────────────────────────────┘
```

### Prompt Engineering

```typescript
// System Prompt Template
const SYSTEM_PROMPT = `
You are MediMind AI, a health information assistant.

CRITICAL RULES:
1. NEVER provide medical diagnoses
2. Use probabilistic language: "may be associated with"
3. NEVER say "You have..." or "This is..."
4. Always include disclaimers
5. For emergencies, direct to immediate care
6. Never encourage delaying emergency treatment

RESPONSE FORMAT:
{
  "severity": 1-5,
  "urgency": "emergency|urgent|doctor_soon|monitor|self_care",
  "summary": "...",
  "possible_explanations": ["...", "..."],
  "warning_signs": ["...", "..."],
  "recommended_action": "...",
  "self_care": ["...", "..."],
  "disclaimer": "..."
}
`;

// User Prompt Template
const USER_PROMPT = `
User symptoms: {input}
Language: {language}

Analyze the symptoms and provide a response in the specified format.
`;
```

### AI Safety Layers

```typescript
// Layer 1: Input Validation
function validateInput(input: string): boolean {
  // Check length, format, etc.
}

// Layer 2: Prompt Injection Detection
function detectInjection(input: string): boolean {
  // Check for injection patterns
}

// Layer 3: Input Sanitization
function sanitizeInput(input: string): string {
  // Remove dangerous content
}

// Layer 4: Output Validation
function validateOutput(output: any): boolean {
  // Validate against Zod schema
}

// Layer 5: Safety Filters
function applySafetyFilters(output: any): any {
  // Ensure no definitive claims
  // Ensure disclaimers present
  // Ensure emergency handling correct
}

// Layer 6: Fallback
function getFallbackResponse(): any {
  // Return safe default response
}
```

---

## 8. API Architecture

### RESTful API Design

```
Base URL: /api/v1

Authentication
POST   /auth/register          # Register new user
POST   /auth/login             # Login
POST   /auth/logout            # Logout
POST   /auth/refresh           # Refresh token
POST   /auth/forgot-password   # Request password reset
POST   /auth/reset-password    # Reset password

Symptoms
POST   /symptoms/analyze       # Analyze symptoms
GET    /symptoms/history       # Get symptom history
GET    /symptoms/:id           # Get specific analysis

Lab Reports
POST   /lab/analyze            # Analyze lab report
POST   /lab/upload             # Upload lab report file
GET    /lab/history            # Get lab history
GET    /lab/:id                # Get specific analysis

Medications
GET    /medications/search     # Search medication
GET    /medications/:id        # Get medication details
POST   /medications/interactions # Check interactions
GET    /medications/user       # Get user's medications
POST   /medications            # Add medication
PUT    /medications/:id        # Update medication
DELETE /medications/:id        # Remove medication

Timeline
GET    /timeline               # Get timeline entries
POST   /timeline               # Add entry
PUT    /timeline/:id           # Update entry
DELETE /timeline/:id           # Delete entry

Profile
GET    /profile                # Get user profile
PUT    /profile                # Update profile
GET    /profile/medical-history # Get medical history
PUT    /profile/medical-history # Update medical history

Dashboard
GET    /dashboard/summary      # Get health summary
GET    /dashboard/recent       # Get recent activity
GET    /dashboard/reminders    # Get reminders
```

### API Response Format

```typescript
// Success Response
{
  "success": true,
   {
    // Response data
  },
  "message": "Optional success message"
}

// Error Response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "User-friendly error message",
    "details": {
      // Validation errors
    }
  }
}

// Paginated Response
{
  "success": true,
   {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

### API Middleware Stack

```typescript
// Request Flow
Request
  ↓
CORS Middleware
  ↓
Security Headers
  ↓
Rate Limiting
  ↓
Body Parser
  ↓
Authentication (if protected)
  ↓
Validation
  ↓
Controller
  ↓
Service
  ↓
Database
  ↓
Response
```

---

## 9. Authentication Architecture

### Authentication Flow

```
┌─────────────────────────────────────┐
│         Registration Flow           │
└─────────────────────────────────────┘

User submits registration form
  ↓
Validate input (email, password)
  ↓
Check if email exists
  ↓
Hash password (bcrypt, 10 rounds)
  ↓
Create user in database
  ↓
Generate JWT token
  ↓
Return token + user data
  ↓
Store token in secure storage
  ↓
Redirect to dashboard

┌─────────────────────────────────────┐
│         Login Flow                  │
└─────────────────────────────────────┘

User submits login form
  ↓
Validate input
  ↓
Find user by email
  ↓
Compare password hash
  ↓
If valid: Generate JWT token
  ↓
Return token + user data
  ↓
Store token
  ↓
Redirect to dashboard

┌─────────────────────────────────────┐
│         Protected Route Flow        │
└─────────────────────────────────────┘

User accesses protected route
  ↓
Check for token in storage
  ↓
If no token: Redirect to login
  ↓
If token: Attach to request header
  ↓
Backend verifies token
  ↓
If valid: Allow access
  ↓
If invalid/expired: Return 401
  ↓
Frontend redirects to login
```

### JWT Token Structure

```typescript
// Token Payload
{
  "userId": "uuid",
  "email": "user@example.com",
  "iat": 1234567890,  // Issued at
  "exp": 1234567890   // Expires at (7 days)
}

// Token Storage
- Access Token: localStorage (encrypted)
- Refresh Token: httpOnly cookie
- Token Expiry: 7 days (access), 30 days (refresh)
```

### Authentication Middleware

```typescript
// Backend Middleware
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Frontend Hook
function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and fetch user
      verifyToken(token).then(user => {
        setUser(user);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);
  
  return { user, loading, login, logout, register };
}
```

---

## 10. Security Architecture

### Security Layers

```
┌─────────────────────────────────────┐
│         Security Layers             │
└─────────────────────────────────────┘

Layer 1: Network Security
  - HTTPS only
  - CORS configuration
  - Security headers
  - DDoS protection

Layer 2: Application Security
  - Input validation (Zod)
  - Output sanitization
  - Rate limiting
  - CSRF protection

Layer 3: Authentication Security
  - JWT tokens
  - Password hashing (bcrypt)
  - Session management
  - Token refresh

Layer 4: Data Security
  - Encryption at rest
  - Encryption in transit
  - Secure storage
  - Data minimization

Layer 5: AI Security
  - Prompt injection detection
  - Output validation
  - Safety filters
  - Fallback responses

Layer 6: File Security
  - File type validation
  - File size limits
  - Virus scanning
  - Secure upload
```

### Security Measures

```typescript
// Input Validation
const inputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  symptoms: z.string().max(5000),
});

// Rate Limiting
const rateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// Password Hashing
const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Encryption
const encrypt = (data: string) => {
  const cipher = crypto.createCipher('aes-256-gcm', ENCRYPTION_KEY);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

// Security Headers
app.use(helmet());
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));
```

### Security Checklist

```
✅ Input validation on all endpoints
✅ Output sanitization
✅ Rate limiting
✅ JWT authentication
✅ Password hashing (bcrypt)
✅ HTTPS only
✅ CORS configuration
✅ Security headers (Helmet)
✅ SQL injection prevention
✅ XSS prevention
✅ CSRF protection
✅ File upload validation
✅ Prompt injection detection
✅ Error handling (no stack traces)
✅ Logging (no sensitive data)
✅ Environment variables
✅ Dependency updates
✅ Security audit
```

---

## 11. Error-Handling Strategy

### Error Categories

```typescript
// 1. Validation Errors (400)
{
  "code": "VALIDATION_ERROR",
  "message": "Invalid input",
  "details": {
    "email": "Invalid email format",
    "password": "Password must be at least 8 characters"
  }
}

// 2. Authentication Errors (401)
{
  "code": "UNAUTHORIZED",
  "message": "Invalid credentials"
}

// 3. Authorization Errors (403)
{
  "code": "FORBIDDEN",
  "message": "You don't have permission to access this resource"
}

// 4. Not Found Errors (404)
{
  "code": "NOT_FOUND",
  "message": "Resource not found"
}

// 5. Server Errors (500)
{
  "code": "INTERNAL_ERROR",
  "message": "Something went wrong. Please try again later."
}

// 6. AI Errors (503)
{
  "code": "AI_SERVICE_ERROR",
  "message": "AI service temporarily unavailable",
  "fallback": { /* fallback response */ }
}
```

### Error Handling Flow

```typescript
// Backend Error Handler
app.use((error, req, res, next) => {
  // Log error (no sensitive data)
  logger.error({
    message: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    path: req.path,
    method: req.method,
  });
  
  // Determine error type
  if (error instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: error.message,
        details: error.details,
      },
    });
  }
  
  if (error instanceof AuthenticationError) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: error.message,
      },
    });
  }
  
  // Default to 500
  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Something went wrong. Please try again later.',
    },
  });
});

// Frontend Error Handler
function useApi() {
  const handleError = (error: any) => {
    if (error.response) {
      // Server responded with error
      const { code, message } = error.response.data.error;
      
      switch (code) {
        case 'UNAUTHORIZED':
          // Redirect to login
          navigate('/login');
          break;
        case 'VALIDATION_ERROR':
          // Show validation errors
          setErrors(error.response.data.error.details);
          break;
        default:
          // Show error toast
          toast.error(message);
      }
    } else if (error.request) {
      // No response received
      toast.error('Network error. Please check your connection.');
    } else {
      // Something else happened
      toast.error('An unexpected error occurred.');
    }
  };
  
  return { handleError };
}
```

### Error Boundaries

```typescript
// React Error Boundary
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    // Log to error tracking service
    logError(error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

---

## 12. Loading-State Strategy

### Loading States

```typescript
// 1. Page Loading
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner size="lg" />
    </div>
  );
}

// 2. Component Loading
function ComponentLoader() {
  return (
    <div className="flex items-center justify-center p-8">
      <LoadingSpinner size="md" />
    </div>
  );
}

// 3. Button Loading
function LoadingButton({ loading, children, ...props }) {
  return (
    <button {...props} disabled={loading}>
      {loading ? (
        <>
          <LoadingSpinner size="sm" />
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

// 4. Skeleton Loading
function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
}
```

### Loading Strategy by Feature

```typescript
// Symptom Checker
function SymptomChecker() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  
  const handleSubmit = async (input) => {
    setLoading(true);
    try {
      const result = await analyzeSymptoms(input);
      setResults(result);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <SymptomForm onSubmit={handleSubmit} loading={loading} />
      {loading && <ComponentLoader />}
      {results && <SymptomResults data={results} />}
    </div>
  );
}

// Timeline (Pagination)
function Timeline() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  
  // Initial load
  useEffect(() => {
    setLoading(true);
    fetchTimeline().then(data => {
      setEntries(data);
      setLoading(false);
    });
  }, []);
  
  // Load more
  const loadMore = async () => {
    setLoadingMore(true);
    const more = await fetchTimeline(page + 1);
    setEntries([...entries, ...more]);
    setLoadingMore(false);
  };
  
  if (loading) return <PageLoader />;
  
  return (
    <div>
      {entries.map(entry => <TimelineEntry key={entry.id} {...entry} />)}
      {loadingMore && <ComponentLoader />}
      <button onClick={loadMore} disabled={loadingMore}>
        Load More
      </button>
    </div>
  );
}
```

---

## 13. Empty-State Strategy

### Empty State Components

```typescript
// Generic Empty State
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">
        {title}
      </h3>
      <p className="text-sm text-text-secondary mb-6 max-w-md">
        {description}
      </p>
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
```

### Empty States by Feature

```typescript
// Timeline Empty State
function TimelineEmptyState() {
  return (
    <EmptyState
      icon={<Clock className="w-8 h-8 text-primary" />}
      title="No health entries yet"
      description="Start tracking your health by adding symptoms, lab results, or notes."
      action={{
        label: "Add Your First Entry",
        onClick: () => navigate('/timeline/add'),
      }}
    />
  );
}

// Lab Reports Empty State
function LabReportsEmptyState() {
  return (
    <EmptyState
      icon={<FlaskConical className="w-8 h-8 text-primary" />}
      title="No lab reports analyzed"
      description="Upload or describe your lab results to get AI-powered explanations."
      action={{
        label: "Analyze Lab Report",
        onClick: () => navigate('/lab'),
      }}
    />
  );
}

// Search Empty State
function SearchEmptyState({ query }) {
  return (
    <EmptyState
      icon={<Search className="w-8 h-8 text-primary" />}
      title="No results found"
      description={`We couldn't find anything matching "${query}". Try a different search term.`}
    />
  );
}
```

---

## 14. Mobile Architecture

### Responsive Breakpoints

```typescript
const breakpoints = {
  xs: 320,   // Small mobile
  sm: 375,   // Standard mobile
  md: 768,   // Tablet
  lg: 1024,  // Laptop
  xl: 1440,  // Desktop
  '2xl': 1920, // Large desktop
};
```

### Mobile-First Design

```css
/* Mobile First */
.container {
  padding: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    padding: 1.5rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

### Mobile Navigation

```typescript
// Bottom Navigation (Mobile)
function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        <NavLink to="/" icon={Home} label="Home" />
        <NavLink to="/symptoms" icon={Heart} label="Symptoms" />
        <NavLink to="/lab" icon={FlaskConical} label="Lab" />
        <NavLink to="/timeline" icon={Clock} label="Timeline" />
        <NavLink to="/profile" icon={User} label="Profile" />
      </div>
    </nav>
  );
}

// Sidebar Navigation (Desktop)
function DesktopNav() {
  return (
    <aside className="hidden md:block w-64 bg-surface border-r border-border">
      <nav className="p-4 space-y-2">
        <NavLink to="/" icon={Home} label="Dashboard" />
        <NavLink to="/symptoms" icon={Heart} label="Symptoms" />
        <NavLink to="/lab" icon={FlaskConical} label="Lab Reports" />
        <NavLink to="/medications" icon={Pill} label="Medications" />
        <NavLink to="/timeline" icon={Clock} label="Timeline" />
        <NavLink to="/profile" icon={User} label="Profile" />
      </nav>
    </aside>
  );
}
```

### Touch Targets

```css
/* Minimum 44px touch targets */
button, a, [role="button"] {
  min-height: 44px;
  min-width: 44px;
}

/* Touch-friendly spacing */
.touch-target {
  padding: 12px 16px;
  margin: 4px;
}
```

### Mobile Optimizations

```typescript
// Detect mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  
  return isMobile;
}

// Conditional rendering
function ResponsiveLayout() {
  const isMobile = useIsMobile();
  
  return isMobile ? <MobileLayout /> : <DesktopLayout />;
}
```

---

## 15. Accessibility Strategy

### WCAG 2.1 AA Compliance

```typescript
// 1. Keyboard Navigation
function useKeyboardNavigation() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        // Ensure focus is visible
        document.body.classList.add('keyboard-nav');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}

// 2. Focus Management
function trapFocus(container: HTMLElement) {
  const focusable = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0] as HTMLElement;
  const last = focusable[focusable.length - 1] as HTMLElement;
  
  function handleTab(e: KeyboardEvent) {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }
  
  container.addEventListener('keydown', handleTab);
  first.focus();
}

// 3. Screen Reader Support
function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// 4. ARIA Labels
<button aria-label="Close menu">
  <XIcon aria-hidden="true" />
</button>

// 5. Color + Text + Icon
<span className="text-critical flex items-center gap-2">
  <AlertCircle aria-hidden="true" />
  <span>High Severity</span>
</span>

// 6. Focus States
*:focus-visible {
  outline: 3px solid #176B67;
  outline-offset: 2px;
}

// 7. Reduced Motion
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

// 8. Skip to Main Content
<a href="#main-content" className="skip-to-main">
  Skip to main content
</a>

// 9. Form Labels
<label htmlFor="email">Email</label>
<input id="email" type="email" aria-describedby="email-error" />
<p id="email-error" role="alert">Invalid email format</p>

// 10. Semantic HTML
<header role="banner">...</header>
<nav role="navigation">...</nav>
<main role="main">...</main>
<footer role="contentinfo">...</footer>
```

### Accessibility Checklist

```
✅ Keyboard navigation works throughout
✅ Focus states are visible
✅ Skip to main content link
✅ ARIA labels on all interactive elements
✅ Color is never the only indicator
✅ Contrast ratios meet WCAG AA (4.5:1)
✅ Touch targets are at least 44px
✅ Reduced motion is respected
✅ High contrast mode works
✅ Form labels are properly associated
✅ Error messages are announced
✅ Heading hierarchy is correct
✅ Landmark regions are defined
✅ Screen reader tested
```

---

## Summary

This architecture provides:

✅ **Scalable**: Modular, feature-based structure  
✅ **Secure**: Multi-layer security approach  
✅ **Accessible**: WCAG 2.1 AA compliant  
✅ **Performant**: Code splitting, lazy loading, caching  
✅ **Maintainable**: Clear separation of concerns  
✅ **Testable**: Well-defined boundaries  
✅ **International**: English/Urdu with RTL support  
✅ **Mobile-First**: Responsive design  
✅ **AI-Safe**: Comprehensive validation and safety layers  
✅ **Production-Ready**: Error handling, loading states, empty states

**Status:** Ready for implementation
