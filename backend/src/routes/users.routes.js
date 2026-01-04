import express from 'express';
import { getPendingUsers, getAllUsers, approveUser, deleteUser } from '../controllers/users.controller.js';
import { verifyToken, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Admin only routes
router.use(verifyToken, authorize('Admin'));

router.get('/', getAllUsers);
router.get('/pending', getPendingUsers);
router.patch('/:id/approve', approveUser);
router.delete('/:id', deleteUser);

export default router;
