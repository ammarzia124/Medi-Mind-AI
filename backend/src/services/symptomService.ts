import { SymptomResult } from '../../types';
import { aiService } from '../ai/aiService';

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
    // return await db.query('SELECT * FROM symptom_analyses WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return [];
  }

  private async saveToDatabase(userId: string, input: string, result: SymptomResult): Promise<void> {
    // TODO: Implement database save
    // await db.query(
    //   'INSERT INTO symptom_analyses (user_id, input_text, result) VALUES ($1, $2, $3)',
    //   [userId, input, JSON.stringify(result)]
    // );
  }
}

export const symptomService = new SymptomService();
