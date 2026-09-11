import { Router } from 'express';
import { medicationController } from '../controllers/medicationController';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = Router();

// POST /api/medications - Add medication (authenticated)
router.post('/', authenticate, validateRequest, medicationController.addMedication);

// GET /api/medications - Get user's medications (authenticated)
router.get('/', authenticate, medicationController.getUserMedications);

// POST /api/medications/interactions - Check interactions (public)
router.post('/interactions', validateRequest, medicationController.checkInteractions);

// DELETE /api/medications/:id - Delete medication (authenticated)
router.delete('/:id', authenticate, medicationController.deleteMedication);

export default router;
