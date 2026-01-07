import express from 'express';
import {
    getAllStatuses,
    createStatus,
    updateStatus,
    deleteStatus,
    reorderStatuses
} from '../controllers/statuses.controller.js';
import { verifyToken, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Shared routes
router.get('/', verifyToken, authorize(['Admin', 'Delivery']), getAllStatuses);

// Admin only management routes
router.post('/', verifyToken, authorize('Admin'), createStatus);
router.patch('/reorder', verifyToken, authorize('Admin'), reorderStatuses);
router.patch('/:id', verifyToken, authorize('Admin'), updateStatus);
router.delete('/:id', verifyToken, authorize('Admin'), deleteStatus);

export default router;
