/**
 * Database Types
 * 
 * TypeScript interfaces for all database entities.
 */

// ============================================================================
// User Types
// ============================================================================

export interface User {
  id: string;
  email: string;
  password_hash: string;
  language_preference: string;
  created_at: Date;
  updated_at: Date;
  last_login_at: Date | null;
  is_active: boolean;
}

export interface CreateUserInput {
  email: string;
  password_hash: string;
  language_preference?: string;
}

export interface UpdateUserInput {
  email?: string;
  language_preference?: string;
  last_login_at?: Date;
  is_active?: boolean;
}

// ============================================================================
// Health Profile Types
// ============================================================================

export interface HealthProfile {
  id: string;
  user_id: string;
  date_of_birth: Date | null;
  gender: string | null;
  preferred_units: string;
  notification_preferences: any;
  created_at: Date;
  updated_at: Date;
}

export interface CreateHealthProfileInput {
  user_id: string;
  date_of_birth?: Date;
  gender?: string;
  preferred_units?: string;
  notification_preferences?: any;
}

export interface UpdateHealthProfileInput {
  date_of_birth?: Date;
  gender?: string;
  preferred_units?: string;
  notification_preferences?: any;
}

// ============================================================================
// Consultation Types
// ============================================================================

export interface Consultation {
  id: string;
  user_id: string;
  type: 'symptom' | 'lab_report';
  user_input: string;
  ai_response: any;
  severity_level: string | null;
  care_navigation: string | null;
  created_at: Date;
}

export interface CreateConsultationInput {
  user_id: string;
  type: 'symptom' | 'lab_report';
  user_input: string;
  ai_response: any;
  severity_level?: string;
  care_navigation?: string;
}

// ============================================================================
// Symptom Types
// ============================================================================

export interface Symptom {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  severity: 'low' | 'moderate' | 'high' | null;
  onset_date: Date | null;
  resolved_date: Date | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateSymptomInput {
  user_id: string;
  title: string;
  description?: string;
  severity?: 'low' | 'moderate' | 'high';
  onset_date?: Date;
}

export interface UpdateSymptomInput {
  title?: string;
  description?: string;
  severity?: 'low' | 'moderate' | 'high';
  resolved_date?: Date;
  is_active?: boolean;
}

// ============================================================================
// Lab Report Types
// ============================================================================

export interface LabReport {
  id: string;
  user_id: string;
  report_name: string | null;
  report_date: Date | null;
  facility_name: string | null;
  summary: string | null;
  file_path: string | null;
  file_hash: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateLabReportInput {
  user_id: string;
  report_name?: string;
  report_date?: Date;
  facility_name?: string;
  summary?: string;
  file_path?: string;
  file_hash?: string;
}

export interface UpdateLabReportInput {
  report_name?: string;
  report_date?: Date;
  facility_name?: string;
  summary?: string;
}

// ============================================================================
// Lab Result Types
// ============================================================================

export interface LabResult {
  id: string;
  lab_report_id: string;
  test_name: string;
  value: number | null;
  unit: string | null;
  reference_range: string | null;
  status: 'normal' | 'abnormal' | 'critical';
  interpretation: string | null;
  created_at: Date;
}

export interface CreateLabResultInput {
  lab_report_id: string;
  test_name: string;
  value?: number;
  unit?: string;
  reference_range?: string;
  status: 'normal' | 'abnormal' | 'critical';
  interpretation?: string;
}

// ============================================================================
// Medication Types
// ============================================================================

export interface Medication {
  id: string;
  user_id: string;
  name: string;
  dosage: string | null;
  frequency: string | null;
  start_date: Date | null;
  end_date: Date | null;
  is_active: boolean;
  reminder_enabled: boolean;
  reminder_time: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateMedicationInput {
  user_id: string;
  name: string;
  dosage?: string;
  frequency?: string;
  start_date?: Date;
  end_date?: Date;
  reminder_enabled?: boolean;
  reminder_time?: string;
}

export interface UpdateMedicationInput {
  name?: string;
  dosage?: string;
  frequency?: string;
  end_date?: Date;
  is_active?: boolean;
  reminder_enabled?: boolean;
  reminder_time?: string;
}

// ============================================================================
// Health Event Types
// ============================================================================

export interface HealthEvent {
  id: string;
  user_id: string;
  event_type: 'symptom' | 'lab' | 'medication' | 'note' | 'appointment';
  title: string;
  description: string | null;
  event_date: Date;
  severity: 'low' | 'moderate' | 'high' | null;
  related_consultation_id: string | null;
  related_lab_report_id: string | null;
  related_medication_id: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateHealthEventInput {
  user_id: string;
  event_type: 'symptom' | 'lab' | 'medication' | 'note' | 'appointment';
  title: string;
  description?: string;
  event_date: Date;
  severity?: 'low' | 'moderate' | 'high';
  related_consultation_id?: string;
  related_lab_report_id?: string;
  related_medication_id?: string;
}

export interface UpdateHealthEventInput {
  title?: string;
  description?: string;
  event_date?: Date;
  severity?: 'low' | 'moderate' | 'high';
}

// ============================================================================
// Query Types
// ============================================================================

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FilterOptions {
  userId?: string;
  startDate?: Date;
  endDate?: Date;
  type?: string;
  severity?: string;
}
