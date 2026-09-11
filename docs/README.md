# MediMind AI - Documentation

## Table of Contents

1. [Architecture Overview](./architecture.md)
2. [API Reference](./api-reference.md)
3. [Database Schema](./database-schema.md)
4. [Design System](./design-system.md)
5. [Internationalization](./i18n.md)
6. [Security](./security.md)
7. [Deployment](./deployment.md)

## Architecture

MediMind AI follows a clean architecture pattern with clear separation between:

- **Frontend** (`/frontend`) - React application with feature-based organization
- **Backend** (`/backend`) - Node.js/Express API server
- **Database** (`/database`) - PostgreSQL schemas and migrations

### Frontend Architecture

```
frontend/
├── app/            # Application shell, routing, providers
├── features/       # Feature modules (symptoms, lab, timeline)
├── components/     # Shared reusable components
├── hooks/          # Custom React hooks
├── services/       # API communication layer
├── types/          # TypeScript interfaces and types
├── utils/          # Pure utility functions
├── lib/            # Third-party library wrappers
├── theme/          # Design tokens and theme config
└── contexts/       # React context providers
```

### Key Design Decisions

1. **Feature-based organization** - Each feature is self-contained
2. **Type safety** - Full TypeScript coverage
3. **Accessibility first** - WCAG 2.1 AA compliance
4. **Progressive disclosure** - Simple UI, sophisticated logic
5. **Offline-first** - Works without network for basic features
