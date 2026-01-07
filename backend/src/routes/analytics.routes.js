import express from 'express';
import { getDashboardStats } from '../controllers/analytics.controller.js';
import { verifyToken, requireCompany, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/dashboard', verifyToken, requireCompany, authorize(['Admin', 'SuperAdmin']), getDashboardStats);

export default router;
