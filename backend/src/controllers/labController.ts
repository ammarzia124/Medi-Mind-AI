import { Request, Response, NextFunction } from 'express';
import { labService } from '../services/labService';
import { analyzeLabReportSchema } from '../validators/labValidator';

export class LabController {
  async analyzeLabReport(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = analyzeLabReportSchema.parse(req.body);
      const result = await labService.analyzeLabReport(validatedData.input);
      
      res.json({
        success: true,
        data: result,
        message: 'Lab report analyzed successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getLabHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const history = await labService.getLabHistory(userId);
      
      res.json({
        success: true,
        data: history,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const labController = new LabController();
