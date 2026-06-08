import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import User from '../models/User.model.js';

const router = express.Router();

// @route  GET /api/user/profile
// @access Protected (any authenticated user)
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch profile.' });
  }
});

export default router;
