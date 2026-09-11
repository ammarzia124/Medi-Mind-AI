-- Seed: sample_consultations
-- Description: Sample consultation data for development and testing

BEGIN;

-- Sample symptom consultations
INSERT INTO consultations (user_id, type, user_input, ai_response, severity_level, care_navigation) VALUES
    ((SELECT id FROM users WHERE email = 'demo@medimind.ai'), 'symptom', 'I have a headache and feel tired', 
     '{"causes": ["Tension", "Dehydration"], "recommendation": "Rest and hydrate", "selfCare": ["Drink water", "Rest"]}',
     'low', 'selfCare'),
    
    ((SELECT id FROM users WHERE email = 'demo@medimind.ai'), 'symptom', 'I have a fever of 102F',
     '{"causes": ["Viral infection"], "recommendation": "Monitor temperature", "selfCare": ["Rest", "Hydrate"]}',
     'moderate', 'routine');

-- Sample lab report consultations
INSERT INTO consultations (user_id, type, user_input, ai_response, severity_level, care_navigation) VALUES
    ((SELECT id FROM users WHERE email = 'user@example.com'), 'lab_report', 'My cholesterol is 240 mg/dL',
     '{"results": [{"name": "Total Cholesterol", "value": "240", "status": "abnormal"}], "summary": "Cholesterol needs attention"}',
     'moderate', 'routine');

COMMIT;
