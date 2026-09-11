-- Consultations Collection
-- AI interaction records for symptom checking and lab analysis
-- Stores only what's needed to provide the service

CREATE TABLE consultations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('symptom', 'lab_report')),
    user_input TEXT NOT NULL,
    ai_response JSONB NOT NULL,
    severity_level VARCHAR(20),
    care_navigation VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for consultations
CREATE INDEX idx_consultations_user_id ON consultations(user_id);
CREATE INDEX idx_consultations_type ON consultations(type);
CREATE INDEX idx_consultations_created_at ON consultations(created_at DESC);
CREATE INDEX idx_consultations_user_type_date ON consultations(user_id, type, created_at DESC);
