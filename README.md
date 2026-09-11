# MediMind AI

**Your Personal Health Co-Pilot**

MediMind AI helps people understand symptoms, analyze lab reports, and navigate their health journey — all in simple, easy-to-understand language. Available in English and Urdu.

> "MediMind doesn't replace your doctor. It helps you understand your health and decide what to do next."

---

## 🌟 Features

- **Symptom Checker** — Describe how you're feeling and get AI-powered analysis with care navigation recommendations
- **Lab Report Analyzer** — Upload or describe lab results and get plain-language explanations
- **Health Timeline** — Track your health journey with an organized timeline of symptoms, lab results, and notes
- **Bilingual Support** — Full English and Urdu (اردو) support with RTL layout
- **Care Navigation** — Clear recommendations on when to seek emergency care, urgent care, routine visits, or self-care

## 📁 Project Structure

```
medimind/
│
├── frontend/           # Frontend application
│   ├── app/            # Main app component and routing
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React contexts (language, auth)
│   ├── data/           # Static data and translations
│   ├── features/       # Feature modules
│   │   ├── home/       # Home page
│   │   ├── symptoms/   # Symptom checker
│   │   ├── lab/        # Lab report analyzer
│   │   └── timeline/   # Health timeline
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility libraries
│   ├── services/       # API service layer
│   ├── theme/          # Theme configuration
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── public/         # Static assets
│   └── tests/          # Test files
│
├── backend/            # Backend services
│   ├── api/            # API route handlers
│   ├── services/       # Business logic
│   ├── models/         # Data models
│   ├── middleware/      # Auth & validation
│   ├── utils/          # Backend utilities
│   └── config/         # Configuration
│
├── database/           # Database schemas & migrations
│   ├── schemas/        # SQL schema definitions
│   ├── seeds/          # Seed data
│   ├── migrations/     # Migration files
│   └── functions/      # Stored procedures
│
├── docs/               # Documentation
├── README.md
└── .env.example
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL 15+ (for backend)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Database Setup

```bash
cd database
# Run migrations
psql -U postgres -d medimind -f schemas/001_initial_schema.sql
# Run seeds
psql -U postgres -d medimind -f seeds/001_sample_data.sql
```

## 🎨 Design System

### Colors

| Role | Color | Hex |
|------|-------|-----|
| Primary | Deep Teal | `#176B67` |
| Secondary | Soft Teal | `#4FA7A1` |
| Background | Warm Off-White | `#F7F9F8` |
| Surface | White | `#FFFFFF` |
| Text Primary | Dark Teal | `#18302F` |
| Text Secondary | Gray | `#60706F` |
| Success | Green | `#3D8B67` |
| Warning | Amber | `#C58B32` |
| Critical | Red | `#C95757` |
| Info | Blue | `#4F7FA3` |

### Typography

- **Primary Font**: Inter (Latin/English)
- **Urdu Font**: Noto Nastaliq Urdu
- All text uses highly readable, accessible sans-serif fonts

## 🛠 Technology Stack

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS 4
- Framer Motion (animations)
- Lucide React (icons)
- React Router DOM

### Backend (planned)
- Node.js + Express
- TypeScript
- PostgreSQL
- JWT Authentication
- Zod validation

## 🌍 Internationalization

MediMind AI supports:
- **English** (LTR)
- **اردو / Urdu** (RTL)

Language can be toggled from the navigation bar.

## ⚕️ Medical Disclaimer

This application is for informational purposes only and is NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions about a medical condition.

## 📄 License

MIT License - See LICENSE file for details.
