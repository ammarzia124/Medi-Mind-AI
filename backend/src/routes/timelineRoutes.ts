import { Router } from 'express';
import { timelineController } from '../controllers/timelineController';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = Router();

// GET /api/timeline - Get timeline entries (authenticated)
router.get('/', authenticate, timelineController.getTimeline);

// POST /api/timeline - Create timeline entry (authenticated)
router.post('/', authenticate, validateRequest, timelineController.createEntry);

// DELETE /api/timeline/:id - Delete timeline entry (authenticated)
router.delete('/:id', authenticate, timelineController.deleteEntry);

export default router;
