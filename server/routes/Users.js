import express from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/index.js';

const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, condition, timezone } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      condition,
      timezone
    });
    
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      condition: user.condition
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Login user - UPDATED WITH BETTER ERROR HANDLING
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt for:', email);
    
    // Input validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    console.log('User found, comparing passwords...');
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    console.log('Login successful for:', email);
    
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      condition: user.condition
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

export default router;