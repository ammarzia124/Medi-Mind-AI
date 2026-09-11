import { LabAnalysis } from '../validators/schemas';
import { aiService } from '../ai/aiService';

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
  async analyzeLabReport(input: string): Promise<LabAnalysis> {
    // Use AI service for analysis
    const result = await aiService.analyzeLabReport(input);
    
    // TODO: Save to database if user is authenticated
    // await this.saveToDatabase(userId, input, result);
    
    return result;
  }

  async getLabHistory(userId: string): Promise<any[]> {
    // TODO: Fetch from database
    // return await db.query('SELECT * FROM consultations WHERE user_id = $1 AND type = $2 ORDER BY created_at DESC', [userId, 'lab_report']);
    return [];
  }

  private async saveToDatabase(userId: string, input: string, result: LabAnalysis): Promise<void> {
    // TODO: Implement database save
    // await db.query(
    //   'INSERT INTO consultations (user_id, type, user_input, ai_response, severity, urgency) VALUES ($1, $2, $3, $4, $5, $6)',
    //   [userId, 'lab_report', input, JSON.stringify(result), result.severity, result.urgency]
    // );
  }
}

export const labService = new LabService();
