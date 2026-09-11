import { Router } from 'express';
import { symptomController } from '../controllers/symptomController';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = Router();

// POST /api/symptoms/analyze - Analyze symptoms (public)
router.post('/analyze', validateRequest, symptomController.analyzeSymptoms);

// GET /api/symptoms/history - Get symptom analysis history (authenticated)
router.get('/history', authenticate, symptomController.getSymptomHistory);

export default router;
