import { Request, Response, NextFunction } from 'express';
import { medicationService } from '../services/medicationService';
import { z } from 'zod';

const addMedicationSchema = z.object({
  name: z.string().min(1).max(200),
  dosage: z.string().max(100).optional(),
  frequency: z.string().max(100).optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
});

const checkInteractionsSchema = z.object({
  medications: z.array(z.string()).min(2, 'At least 2 medications required'),
});

export class MedicationController {
  async addMedication(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = addMedicationSchema.parse(req.body);
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const medication = await medicationService.addMedication(userId, validatedData);
      
      res.status(201).json({
        success: true,
        medication,
        message: 'Medication added successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserMedications(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const medications = await medicationService.getUserMedications(userId);
      
      res.json({
        success: true,
        medications,
      });
    } catch (error) {
      next(error);
    }
  }

  async checkInteractions(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = checkInteractionsSchema.parse(req.body);
      const result = await medicationService.checkInteractions(validatedData.medications);
      
      res.json({
        success: true,
        result,
        message: 'Interaction check completed',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteMedication(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      await medicationService.deleteMedication(userId, id);
      
      res.json({
        success: true,
        message: 'Medication deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const medicationController = new MedicationController();
