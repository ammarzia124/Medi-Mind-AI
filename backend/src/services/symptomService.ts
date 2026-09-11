import { SymptomResult } from '../../types';
import { aiService } from '../ai/aiService';

/**
 * Symptom Service
 * 
 * IMPORTANT: This service NEVER provides medical diagnoses.
 * All responses use probabilistic, non-definitive language:
 * - "This may be associated with..." (NOT "You have...")
 * - "Possible explanations include..." (NOT "The cause is...")
 * - "This could indicate..." (NOT "This means...")
 * 
 * For emergencies, we clearly advise immediate medical care
 * and NEVER encourage users to delay treatment.
 */
export class SymptomService {
  async analyzeSymptoms(input: string): Promise<SymptomResult> {
    // Use AI service for analysis
    const result = await aiService.analyzeSymptoms(input);
    
    // TODO: Save to database if user is authenticated
    // await this.saveToDatabase(userId, input, result);
    
    return result;
  }

  async getSymptomHistory(userId: string): Promise<any[]> {
    // TODO: Fetch from database
    // return await db.query('SELECT * FROM consultations WHERE user_id = $1 AND type = $2 ORDER BY created_at DESC', [userId, 'symptom']);
    return [];
  }

  private async saveToDatabase(userId: string, input: string, result: SymptomResult): Promise<void> {
    // TODO: Implement database save
    // await db.query(
    //   'INSERT INTO consultations (user_id, type, user_input, ai_response, severity_level, care_navigation) VALUES ($1, $2, $3, $4, $5, $6)',
    //   [userId, 'symptom', input, JSON.stringify(result), result.severity, result.careNavigation]
    // );
  }
}

export const symptomService = new SymptomService();
