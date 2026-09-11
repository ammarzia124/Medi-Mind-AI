-- Seed: sample_health_data
-- Description: Sample health data for development and testing

BEGIN;

-- Sample symptoms
INSERT INTO symptoms (user_id, title, description, severity, is_active) VALUES
    ((SELECT id FROM users WHERE email = 'demo@medimind.ai'), 'Headache', 'Mild headache in the morning', 'low', false),
    ((SELECT id FROM users WHERE email = 'demo@medimind.ai'), 'Fatigue', 'Feeling tired throughout the day', 'low', true);

-- Sample lab reports
INSERT INTO lab_reports (user_id, report_name, report_date, facility_name, summary) VALUES
    ((SELECT id FROM users WHERE email = 'user@example.com'), 'Complete Blood Count', '2024-01-15', 'City Medical Center', 'All values within normal range'),
    ((SELECT id FROM users WHERE email = 'user@example.com'), 'Lipid Panel', '2024-01-15', 'City Medical Center', 'Cholesterol slightly elevated');

-- Sample lab results
INSERT INTO lab_results (lab_report_id, test_name, value, unit, reference_range, status, interpretation) VALUES
    ((SELECT id FROM lab_reports WHERE report_name = 'Complete Blood Count'), 'Hemoglobin', 14.2, 'g/dL', '12.0-17.5', 'normal', 'Within normal range'),
    ((SELECT id FROM lab_reports WHERE report_name = 'Lipid Panel'), 'Total Cholesterol', 240, 'mg/dL', '<200', 'abnormal', 'Slightly elevated');

-- Sample medications
INSERT INTO medications (user_id, name, dosage, frequency, start_date, is_active, reminder_enabled) VALUES
    ((SELECT id FROM users WHERE email = 'demo@medimind.ai'), 'Vitamin D3', '2000 IU', 'Once daily', '2024-01-01', true, true),
    ((SELECT id FROM users WHERE email = 'user@example.com'), 'Multivitamin', '1 tablet', 'Once daily', '2023-12-01', true, false);

-- Sample health events
INSERT INTO health_events (user_id, event_type, title, description, event_date, severity) VALUES
    ((SELECT id FROM users WHERE email = 'demo@medimind.ai'), 'symptom', 'Headache', 'Mild headache', NOW() - INTERVAL '2 hours', 'low'),
    ((SELECT id FROM users WHERE email = 'demo@medimind.ai'), 'lab', 'Vitamin D Test', 'Level: 18 ng/mL', NOW() - INTERVAL '1 day', NULL),
    ((SELECT id FROM users WHERE email = 'demo@medimind.ai'), 'medication', 'Started Vitamin D', '2000 IU daily', NOW() - INTERVAL '1 day', NULL),
    ((SELECT id FROM users WHERE email = 'demo@medimind.ai'), 'note', 'Annual Check-up', 'Routine blood work completed', NOW() - INTERVAL '2 days', NULL);

COMMIT;
