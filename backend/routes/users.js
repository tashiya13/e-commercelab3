const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const auth = require('../middleware/auth');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        error: 'Please provide all required fields: name, email, and password' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create user with detailed error logging
    console.log('Attempting to create user:', { name, email });
    const user = await User.create({ 
      name, 
      email, 
      password 
    });
    console.log('User created successfully:', { id: user.id, email: user.email });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id }, 
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data (excluding password)
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email
    };

    res.status(201).json({ 
      user: userResponse, 
      token,
      message: 'Registration successful' 
    });
  } catch (error) {
    console.error('Registration error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    // Handle specific Sequelize errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.errors.map(e => e.message) 
      });
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        error: 'Email already registered' 
      });
    }

    res.status(500).json({ 
      error: 'Registration failed', 
      message: error.message 
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.validatePassword(password))) {
      throw new Error('Invalid login credentials');
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  res.json(req.user);
});

// Update user profile
router.patch('/profile', auth, async (req, res) => {
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