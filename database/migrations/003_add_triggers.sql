-- Migration: 003_add_triggers
-- Date: 2024-01-01
-- Description: Add triggers for automatic timestamp updates

BEGIN;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for users
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Triggers for health_profiles
CREATE TRIGGER update_health_profiles_updated_at
    BEFORE UPDATE ON health_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Triggers for symptoms
CREATE TRIGGER update_symptoms_updated_at
    BEFORE UPDATE ON symptoms
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Triggers for lab_reports
CREATE TRIGGER update_lab_reports_updated_at
    BEFORE UPDATE ON lab_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Triggers for medications
CREATE TRIGGER update_medications_updated_at
    BEFORE UPDATE ON medications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Triggers for health_events
CREATE TRIGGER update_health_events_updated_at
    BEFORE UPDATE ON health_events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMIT;
