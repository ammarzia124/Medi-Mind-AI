import { SymptomAnalysis } from '../validators/schemas';
import { aiService } from '../ai/AIService';
import { logger } from '../utils/logger';

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
  /**
   * Analyze symptoms using AI
   */
  async analyzeSymptoms(input: string): Promise<SymptomAnalysis> {
    logger.info('Analyzing symptoms', { inputLength: input.length });
    
    // Use AI service with safety pipeline
    const result = await aiService.analyzeSymptoms(input);
    
    logger.info('Symptom analysis completed', { 
        severity: result.severity, 
        urgency: result.urgency 
    });
    
    // TODO: Save to database if user is authenticated
    // await this.saveToDatabase(userId, input, result);
    
    return result;
  }

  /**
   * Get symptom analysis history
   */
  async getSymptomHistory(userId: string): Promise<any[]> {
    logger.info('Getting symptom history', { userId });
    
    // TODO: Fetch from database
    // return await db.query('SELECT * FROM consultations WHERE user_id = $1 AND type = $2 ORDER BY created_at DESC', [userId, 'symptom']);
    return [];
  }

  /**
   * Save symptom analysis to database
   */
  private async saveToDatabase(userId: string, input: string, result: SymptomAnalysis): Promise<void> {
    logger.info('Saving symptom analysis to database', { userId });
    
    // TODO: Implement database save
    // await db.query(
    //   'INSERT INTO consultations (user_id, type, user_input, ai_response, severity, urgency) VALUES ($1, $2, $3, $4, $5, $6)',
    //   [userId, 'symptom', input, JSON.stringify(result), result.severity, result.urgency]
    // );
  }
}

export const symptomService = new SymptomService();
