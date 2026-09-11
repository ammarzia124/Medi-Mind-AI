-- Health Profiles Collection
-- Basic user preferences and settings only
-- NO medical information stored here

CREATE TABLE health_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date_of_birth DATE,
    gender VARCHAR(20),
    preferred_units VARCHAR(10) DEFAULT 'metric',
    notification_preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_user_profile UNIQUE (user_id)
);

-- Indexes for health_profiles
CREATE INDEX idx_health_profiles_user_id ON health_profiles(user_id);
CREATE INDEX idx_health_profiles_created_at ON health_profiles(created_at DESC);
