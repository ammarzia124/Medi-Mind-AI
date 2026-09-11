# MediMind AI - Database

## Overview

Privacy-first database design for MediMind AI. We follow the principle of **data minimization** - only storing what's absolutely necessary for the application to function.

## 📁 Structure

```
database/
├── schemas/              # Individual table schemas
│   ├── users.sql
│   ├── health_profiles.sql
│   ├── consultations.sql
│   ├── symptoms.sql
│   ├── lab_reports.sql
│   ├── lab_results.sql
│   ├── medications.sql
│   └── health_events.sql
│
├── migrations/           # Database migrations
│   ├── 001_initial_schema.sql
│   ├── 002_add_indexes.sql
│   └── 003_add_triggers.sql
│
├── seed/                 # Sample data for development
│   ├── sample_users.sql
│   ├── sample_consultations.sql
│   └── sample_health_data.sql
│
├── indexes/              # Consolidated index definitions
│   └── all_indexes.sql
│
└── README.md
```

## 🗄️ Collections

### 1. users
**Purpose**: Authentication and user management  
**Data Stored**:
- Email (unique identifier)
- Password hash (bcrypt)
- Language preference
- Account status

**Privacy Note**: Minimal authentication data only.

---

### 2. health_profiles
**Purpose**: Basic user preferences  
**Data Stored**:
- Date of birth (optional)
- Gender (optional)
- Preferred units (metric/imperial)
- Notification preferences

**Privacy Note**: NO medical information stored. Only basic demographics for personalization.

---

### 3. consultations
**Purpose**: AI interaction history  
**Data Stored**:
- User input (what they asked)
- AI response (analysis results)
- Severity level
- Care navigation recommendation

**Privacy Note**: Stores only what's needed to provide the service and maintain conversation history.

---

### 4. symptoms
**Purpose**: Symptom tracking for timeline  
**Data Stored**:
- Symptom title
- Description (optional)
- Severity level
- Active status
- Dates (onset/resolution)

**Privacy Note**: Minimal symptom data for user experience. Users control what they track.

---

### 5. lab_reports
**Purpose**: Lab report metadata  
**Data Stored**:
- Report name
- Report date
- Facility name
- Summary (optional)
- File path/hash (if uploaded)

**Privacy Note**: Metadata only. Actual lab values stored separately in lab_results.

---

### 6. lab_results
**Purpose**: Individual lab test values  
**Data Stored**:
- Test name
- Value and unit
- Reference range
- Status (normal/abnormal/critical)
- Interpretation

**Privacy Note**: Only stores results that users explicitly analyze through the app.

---

### 7. medications
**Purpose**: Medication tracking and reminders  
**Data Stored**:
- Medication name
- Dosage
- Frequency
- Start/end dates
- Reminder settings

**Privacy Note**: Minimal data for medication reminders. No pharmacy or prescription details.

---

### 8. health_events
**Purpose**: Timeline feature  
**Data Stored**:
- Event type (symptom/lab/medication/note/appointment)
- Title
- Description (optional)
- Event date
- Severity (optional)
- Related IDs (consultation/lab_report/medication)

**Privacy Note**: Aggregated timeline view. Links to other collections without duplicating data.

## 🔒 Privacy Principles

### Data Minimization
We only store:
- ✅ What's needed for core functionality
- ✅ What users explicitly choose to track
- ✅ Minimal metadata for organization

We do NOT store:
- ❌ Unnecessary personal information
- ❌ Detailed medical histories unless user-initiated
- ❌ Third-party medical records
- ❌ Insurance or billing information
- ❌ Doctor contact details
- ❌ Pharmacy information

### User Control
- Users can delete their data at any time
- Cascading deletes ensure complete data removal
- No data is shared with third parties
- All data is encrypted at rest (planned)

### Security
- Passwords hashed with bcrypt (10 rounds)
- JWT tokens for authentication
- AES-256-GCM encryption for sensitive data
- Input sanitization prevents SQL injection
- Rate limiting prevents abuse

## 🚀 Setup

### Prerequisites
- PostgreSQL 15+
- psql command-line tool

### Create Database
```bash
createdb medimind
```

### Run Migrations
```bash
# Run in order
psql -U postgres -d medimind -f migrations/001_initial_schema.sql
psql -U postgres -d medimind -f migrations/002_add_indexes.sql
psql -U postgres -d medimind -f migrations/003_add_triggers.sql
```

### Load Sample Data (Development Only)
```bash
psql -U postgres -d medimind -f seed/sample_users.sql
psql -U postgres -d medimind -f seed/sample_consultations.sql
psql -U postgres -d medimind -f seed/sample_health_data.sql
```

### Apply All Indexes
```bash
psql -U postgres -d medimind -f indexes/all_indexes.sql
```

## 📊 Schema Design

### Relationships
```
users
├── health_profiles (1:1)
├── consultations (1:N)
├── symptoms (1:N)
├── lab_reports (1:N)
│   └── lab_results (1:N)
├── medications (1:N)
└── health_events (1:N)
    ├── related_consultation_id
    ├── related_lab_report_id
    └── related_medication_id
```

### Cascade Deletes
When a user is deleted:
- All related data is automatically deleted
- No orphaned records
- Complete data removal for privacy

### Indexes
Optimized for common queries:
- User lookups by email
- Timeline queries by user and date
- Active symptoms/medications
- Consultation history

## 🔧 Maintenance

### Backups
```bash
# Full backup
pg_dump -U postgres medimind > backup_$(date +%Y%m%d).sql

# Restore
psql -U postgres -d medimind < backup_20240101.sql
```

### Monitoring
```sql
-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check index usage
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

### Cleanup
```sql
-- Delete old consultations (older than 1 year)
DELETE FROM consultations 
WHERE created_at < NOW() - INTERVAL '1 year';

-- Delete inactive symptoms (resolved more than 6 months ago)
UPDATE symptoms 
SET is_active = false 
WHERE resolved_date < NOW() - INTERVAL '6 months';
```

## 📈 Performance

### Query Optimization
- All foreign keys indexed
- Composite indexes for common queries
- Partial indexes for active records
- JSONB for flexible AI responses

### Expected Performance
- User lookup: <10ms
- Timeline query: <50ms
- Consultation history: <100ms
- Full text search: <200ms

## 🧪 Testing

### Test Database
```bash
# Create test database
createdb medimind_test

# Run migrations
psql -U postgres -d medimind_test -f migrations/001_initial_schema.sql
psql -U postgres -d medimind_test -f migrations/002_add_indexes.sql
psql -U postgres -d medimind_test -f migrations/003_add_triggers.sql

# Load test data
psql -U postgres -d medimind_test -f seed/sample_users.sql
```

## 📝 Migration Guidelines

### Creating New Migrations
1. Name format: `NNN_description.sql` (e.g., `004_add_notifications.sql`)
2. Always use `BEGIN;` and `COMMIT;`
3. Test in development first
4. Document changes in README
5. Update seed data if needed

### Migration Checklist
- [ ] Schema changes tested
- [ ] Indexes added for new columns
- [ ] Triggers updated if needed
- [ ] Seed data updated
- [ ] Documentation updated
- [ ] Backup created before migration

## 🔐 Security Checklist

- [x] Passwords hashed with bcrypt
- [x] Foreign key constraints with CASCADE
- [x] Input validation in application layer
- [x] No sensitive data in logs
- [x] Encrypted connections (SSL/TLS)
- [x] Regular backups
- [x] Access control (database user permissions)
- [x] Audit logging (planned)

## 📚 Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Database Design Best Practices](https://www.postgresql.org/docs/current/ddl.html)
- [Indexing Strategies](https://www.postgresql.org/docs/current/indexes.html)
- [Security Best Practices](https://www.postgresql.org/docs/current/security.html)

## 🤝 Contributing

When modifying the database:
1. Create a new migration file
2. Test thoroughly in development
3. Update this README
4. Update seed data if needed
5. Document any breaking changes

## ⚖️ Compliance

This database design follows:
- **HIPAA** guidelines (minimal PHI storage)
- **GDPR** principles (data minimization, right to deletion)
- **Privacy by Design** principles
- **Data Protection** best practices

---

**Last Updated**: 2024-01-01  
**Version**: 1.0.0  
**PostgreSQL Version**: 15+
