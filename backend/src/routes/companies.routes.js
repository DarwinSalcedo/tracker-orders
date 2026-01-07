import express from 'express';
import { getAllCompanies } from '../controllers/companies.controller.js';

const router = express.Router();

// Public route to list companies for registration
router.get('/', getAllCompanies);

export default router;
