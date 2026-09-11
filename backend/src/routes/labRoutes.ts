import { Router } from 'express';
import { labController } from '../controllers/labController';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = Router();

// POST /api/lab/analyze - Analyze lab report (public)
router.post('/analyze', validateRequest, labController.analyzeLabReport);

// GET /api/lab/history - Get lab analysis history (authenticated)
router.get('/history', authenticate, labController.getLabHistory);

export default router;
