import { LabAnalysis } from '../validators/schemas';
import { aiService } from '../ai/AIService';
import { logger } from '../utils/logger';

/**
 * Lab Service
 * 
 * IMPORTANT: This service NEVER provides medical diagnoses.
 * All responses use probabilistic, non-definitive language:
 * - "This may be associated with..." (NOT "You have...")
 * - "This value may suggest..." (NOT "This means...")
 * - "These results may indicate..." (NOT "You have...")
 * 
 * Lab results are always presented as requiring professional
 * interpretation by a qualified healthcare provider.
 */
export class LabService {
  /**
   * Analyze lab report using AI
   */
  async analyzeLabReport(input: string): Promise<LabAnalysis> {
    logger.info('Analyzing lab report', { inputLength: input.length });
    
    // Use AI service with safety pipeline
    const result = await aiService.analyzeLabReport(input);
    
    logger.info('Lab report analysis completed', { 
        severity: result.severity, 
        urgency: result.urgency,
        resultsCount: result.results.length
    });
    
    // TODO: Save to database if user is authenticated
    // await this.saveToDatabase(userId, input, result);
    
    return result;
  }

  /**
   * Get lab analysis history
   */
  async getLabHistory(userId: string): Promise<any[]> {
    logger.info('Getting lab history', { userId });
    
    // TODO: Fetch from database
    // return await db.query('SELECT * FROM consultations WHERE user_id = $1 AND type = $2 ORDER BY created_at DESC', [userId, 'lab_report']);
    return [];
  }

  /**
   * Save lab analysis to database
   */
  private async saveToDatabase(userId: string, input: string, result: LabAnalysis): Promise<void> {
    logger.info('Saving lab analysis to database', { userId });
    
    // TODO: Implement database save
    // await db.query(
    //   'INSERT INTO consultations (user_id, type, user_input, ai_response, severity, urgency) VALUES ($1, $2, $3, $4, $5, $6)',
    //   [userId, 'lab_report', input, JSON.stringify(result), result.severity, result.urgency]
    // );
  }
}

export const labService = new LabService();
