-- Health Events Collection
-- Timeline events for health journey tracking
-- Minimal data for timeline feature

CREATE TABLE health_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('symptom', 'lab', 'medication', 'note', 'appointment')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    severity VARCHAR(20) CHECK (severity IN ('low', 'moderate', 'high')),
    related_consultation_id UUID REFERENCES consultations(id) ON DELETE SET NULL,
    related_lab_report_id UUID REFERENCES lab_reports(id) ON DELETE SET NULL,
    related_medication_id UUID REFERENCES medications(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for health_events
CREATE INDEX idx_health_events_user_id ON health_events(user_id);
CREATE INDEX idx_health_events_event_type ON health_events(event_type);
CREATE INDEX idx_health_events_event_date ON health_events(event_date DESC);
CREATE INDEX idx_health_events_user_date ON health_events(user_id, event_date DESC);
CREATE INDEX idx_health_events_user_type_date ON health_events(user_id, event_type, event_date DESC);
