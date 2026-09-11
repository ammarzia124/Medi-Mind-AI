import { Request, Response, NextFunction } from 'express';
import { symptomService } from '../services/symptomService';
import { analyzeSymptomsSchema } from '../validators/symptomValidator';

export class SymptomController {
  async analyzeSymptoms(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = analyzeSymptomsSchema.parse(req.body);
      const result = await symptomService.analyzeSymptoms(validatedData.input);
      
      res.json({
        success: true,
        data: result,
        message: 'Symptoms analyzed successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getSymptomHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const history = await symptomService.getSymptomHistory(userId);
      
      res.json({
        success: true,
        data: history,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const symptomController = new SymptomController();
