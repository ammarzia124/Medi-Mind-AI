import { Router } from 'express';
import authRoutes from './authRoutes';
import symptomRoutes from './symptomRoutes';
import labRoutes from './labRoutes';
import timelineRoutes from './timelineRoutes';
import medicationRoutes from './medicationRoutes';

const router = Router();

// Mount all routes
router.use('/auth', authRoutes);
router.use('/symptoms', symptomRoutes);
router.use('/lab', labRoutes);
router.use('/timeline', timelineRoutes);
router.use('/medications', medicationRoutes);

export default router;
