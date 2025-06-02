const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { protect } = require('../middleware/authMiddleware');
const { registerUser, loginUser } = require('../controllers/authController');

// Register and Login routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Get user profile
router.get('/profile', protect, async (req, res) => {
  res.json(req.user);
});

// Update user profile
router.patch('/profile', protect, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ error: 'Invalid updates!' });
  }

  try {
    updates.forEach(update => req.user[update] = req.body[update]);
    await req.user.save();
    res.json(req.user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; 