import User from '../models/User.model.js';


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch users.' });
  }
};

const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalRegularUsers = await User.countDocuments({ role: 'user' });
    const activeUsers = await User.countDocuments({ isActive: true });

    // Recent registrations (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentRegistrations = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalAdmins,
        totalRegularUsers,
        activeUsers,
        recentRegistrations,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch stats.' });
  }
};


const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot deactivate your own account.' });
    }
    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });
    return res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully.`,
      user,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update user status.' });
  }
};

export { getAllUsers, getStats, toggleUserStatus };
