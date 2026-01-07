import express from 'express';
import { getAllCompanies, createCompany } from '../controllers/companies.controller.js';
import { verifyToken, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public route to list companies for registration
router.get('/', getAllCompanies);

// Super Admin only
router.post('/', verifyToken, authorize('SuperAdmin'), createCompany);

export default router;
