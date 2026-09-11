-- Seed: sample_users
-- Description: Sample user data for development and testing

BEGIN;

-- Sample user (password: "Password123!" hashed with bcrypt)
INSERT INTO users (email, password_hash, language_preference, is_active) VALUES
    ('demo@medimind.ai', '$2a$10$example_hash_placeholder_for_demo_user', 'en', true),
    ('user@example.com', '$2a$10$example_hash_placeholder_for_test_user', 'en', true);

-- Sample health profiles
INSERT INTO health_profiles (user_id, date_of_birth, gender, preferred_units) VALUES
    ((SELECT id FROM users WHERE email = 'demo@medimind.ai'), '1990-01-15', 'male', 'metric'),
    ((SELECT id FROM users WHERE email = 'user@example.com'), '1985-06-20', 'female', 'imperial');

COMMIT;
