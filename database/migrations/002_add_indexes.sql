-- Migration: 002_add_indexes
-- Date: 2024-01-01
-- Description: Add performance indexes to all tables

BEGIN;

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at DESC);
CREATE INDEX idx_users_is_active ON users(is_active) WHERE is_active = true;

-- Health Profiles indexes
CREATE INDEX idx_health_profiles_user_id ON health_profiles(user_id);
CREATE INDEX idx_health_profiles_created_at ON health_profiles(created_at DESC);

-- Consultations indexes
CREATE INDEX idx_consultations_user_id ON consultations(user_id);
CREATE INDEX idx_consultations_type ON consultations(type);
CREATE INDEX idx_consultations_created_at ON consultations(created_at DESC);
CREATE INDEX idx_consultations_user_type_date ON consultations(user_id, type, created_at DESC);
CREATE INDEX idx_consultations_severity ON consultations(severity_level) WHERE severity_level IS NOT NULL;

-- Symptoms indexes
CREATE INDEX idx_symptoms_user_id ON symptoms(user_id);
CREATE INDEX idx_symptoms_is_active ON symptoms(is_active) WHERE is_active = true;
CREATE INDEX idx_symptoms_created_at ON symptoms(created_at DESC);
CREATE INDEX idx_symptoms_user_active ON symptoms(user_id, is_active, created_at DESC);
CREATE INDEX idx_symptoms_severity ON symptoms(severity) WHERE severity IS NOT NULL;

-- Lab Reports indexes
CREATE INDEX idx_lab_reports_user_id ON lab_reports(user_id);
CREATE INDEX idx_lab_reports_report_date ON lab_reports(report_date DESC);
CREATE INDEX idx_lab_reports_created_at ON lab_reports(created_at DESC);
CREATE INDEX idx_lab_reports_user_date ON lab_reports(user_id, report_date DESC);
CREATE INDEX idx_lab_reports_file_hash ON lab_reports(file_hash) WHERE file_hash IS NOT NULL;

-- Lab Results indexes
CREATE INDEX idx_lab_results_lab_report_id ON lab_results(lab_report_id);
CREATE INDEX idx_lab_results_test_name ON lab_results(test_name);
CREATE INDEX idx_lab_results_status ON lab_results(status);
CREATE INDEX idx_lab_results_report_status ON lab_results(lab_report_id, status);
CREATE INDEX idx_lab_results_test_status ON lab_results(test_name, status);

-- Medications indexes
CREATE INDEX idx_medications_user_id ON medications(user_id);
CREATE INDEX idx_medications_is_active ON medications(is_active) WHERE is_active = true;
CREATE INDEX idx_medications_created_at ON medications(created_at DESC);
CREATE INDEX idx_medications_user_active ON medications(user_id, is_active, created_at DESC);
CREATE INDEX idx_medications_reminder_enabled ON medications(reminder_enabled) WHERE reminder_enabled = true;

-- Health Events indexes
CREATE INDEX idx_health_events_user_id ON health_events(user_id);
CREATE INDEX idx_health_events_event_type ON health_events(event_type);
CREATE INDEX idx_health_events_event_date ON health_events(event_date DESC);
CREATE INDEX idx_health_events_user_date ON health_events(user_id, event_date DESC);
CREATE INDEX idx_health_events_user_type_date ON health_events(user_id, event_type, event_date DESC);
CREATE INDEX idx_health_events_severity ON health_events(severity) WHERE severity IS NOT NULL;

COMMIT;
