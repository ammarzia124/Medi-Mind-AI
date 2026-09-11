import { Request, Response, NextFunction } from 'express';
import { timelineService } from '../services/timelineService';
import { createTimelineEntrySchema } from '../validators/timelineValidator';

export class TimelineController {
  async getTimeline(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const { limit = '50', offset = '0' } = req.query;
      const timeline = await timelineService.getTimeline(userId, {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      });
      
      res.json({
        success: true,
        data: timeline,
      });
    } catch (error) {
      next(error);
    }
  }

  async createEntry(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const validatedData = createTimelineEntrySchema.parse(req.body);
      const entry = await timelineService.createEntry(userId, validatedData);
      
      res.status(201).json({
        success: true,
        data: entry,
        message: 'Timeline entry created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteEntry(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const { id } = req.params;
      await timelineService.deleteEntry(userId, id);
      
      res.json({
        success: true,
        message: 'Timeline entry deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const timelineController = new TimelineController();
