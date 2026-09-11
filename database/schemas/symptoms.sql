-- Symptoms Collection
-- Minimal symptom tracking for timeline feature
-- Only essential data for user experience

CREATE TABLE symptoms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    severity VARCHAR(20) CHECK (severity IN ('low', 'moderate', 'high')),
    onset_date TIMESTAMP WITH TIME ZONE,
    resolved_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for symptoms
CREATE INDEX idx_symptoms_user_id ON symptoms(user_id);
CREATE INDEX idx_symptoms_is_active ON symptoms(is_active) WHERE is_active = true;
CREATE INDEX idx_symptoms_created_at ON symptoms(created_at DESC);
CREATE INDEX idx_symptoms_user_active ON symptoms(user_id, is_active, created_at DESC);
