import express from 'express';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
import { getAllUsers, getStats, toggleUserStatus } from '../controllers/admin.controller.js';

const router = express.Router();

// All admin routes require auth + admin role
router.use(protect, adminOnly);

router.get('/users', getAllUsers);
router.get('/stats', getStats);
router.patch('/users/:id/toggle', toggleUserStatus);

export default router;
