import express from 'express';
import { register, login, getMe } from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// PUBLIC — no token needed
router.post('/register', register);
router.post('/login', login);

// PROTECTED — token required
router.get('/me', verifyToken, getMe);

// TEMP DEBUG — no token
router.get('/debug', async (req, res) => {
  try {
    const users = await User.find().select('name email role createdAt');
    const testHash = await bcrypt.hash('test123', 12);
    const testCompare = await bcrypt.compare('test123', testHash);
    res.json({
      userCount: users.length,
      users,
      bcryptWorking: testCompare,
    });
  } catch (err) {
    res.json({ error: err.message });
  }
});

export default router;