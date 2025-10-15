import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { User } from '../models/User.js';

const router = express.Router();

router.get('/me', requireAuth, async (req, res) => {
  const me = await User.findById(req.user.id).select('-passwordHash');
  return res.json(me);
});

router.get('/search', requireAuth, async (req, res) => {
  const q = (req.query.q || '').toString();
  if (!q) return res.json([]);
  const users = await User.find({ username: { $regex: q, $options: 'i' } }).select('username profilePic');
  return res.json(users);
});

export default router;

