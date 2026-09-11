import { Router } from 'express';
import { authController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = Router();

// POST /api/auth/register - Register new user (public)
router.post('/register', validateRequest, authController.register);

// POST /api/auth/login - Login user (public)
router.post('/login', validateRequest, authController.login);

// GET /api/auth/profile - Get user profile (authenticated)
router.get('/profile', authenticate, authController.getProfile);

// PUT /api/auth/profile - Update user profile (authenticated)
router.put('/profile', authenticate, validateRequest, authController.updateProfile);

export default router;
