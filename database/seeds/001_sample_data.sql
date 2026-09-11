-- MediMind AI Seed Data
-- Insert sample data for development

-- Sample user (password: "password123" hashed with bcrypt)
INSERT INTO users (email, password_hash, full_name, language_preference) VALUES
  ('demo@medimind.ai', '$2a$10$example_hash_placeholder', 'Demo User', 'en');

-- Sample timeline entries
INSERT INTO timeline_entries (user_id, type, title, description, severity) VALUES
  ((SELECT id FROM users WHERE email = 'demo@medimind.ai'), 'symptom', 'Headache & Fatigue', 'Mild headache in the morning, felt tired throughout the day.', 'low'),
  ((SELECT id FROM users WHERE email = 'demo@medimind.ai'), 'lab', 'Vitamin D Test', 'Vitamin D level: 18 ng/mL (Low).', NULL),
  ((SELECT id FROM users WHERE email = 'demo@medimind.ai'), 'note', 'Annual Check-up', 'Routine blood work completed.', NULL);
