import express from 'express';
import { getPendingUsers, getAllUsers, approveUser, deleteUser, createCompanyAdmin } from '../controllers/users.controller.js';
import { verifyToken, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Super Admin route
router.post('/admin', verifyToken, authorize('SuperAdmin'), createCompanyAdmin);

// Admin only routes
router.use(verifyToken, authorize(['Admin', 'SuperAdmin']));

router.get('/', getAllUsers);
router.get('/pending', getPendingUsers);
router.patch('/:id/approve', approveUser);
router.delete('/:id', deleteUser);

export default router;
