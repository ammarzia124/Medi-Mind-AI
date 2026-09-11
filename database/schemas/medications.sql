-- Medications Collection
-- Minimal medication tracking for reminders and timeline
-- Only essential data for user experience

CREATE TABLE medications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100),
    frequency VARCHAR(100),
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    reminder_enabled BOOLEAN DEFAULT false,
    reminder_time TIME,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for medications
CREATE INDEX idx_medications_user_id ON medications(user_id);
CREATE INDEX idx_medications_is_active ON medications(is_active) WHERE is_active = true;
CREATE INDEX idx_medications_created_at ON medications(created_at DESC);
CREATE INDEX idx_medications_user_active ON medications(user_id, is_active, created_at DESC);
