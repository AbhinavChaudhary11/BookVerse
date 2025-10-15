import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { User } from '../models/User.js';

const router = express.Router();

// GET library — do NOT overwrite status based on isRead anymore
router.get('/', requireAuth, async (req, res) => {
  const me = await User.findById(req.user.id).select('library');
  if (!me) return res.json([]);
  // Simply return the library as-is
  return res.json(me.library);
});

router.post('/add', requireAuth, async (req, res) => {
  const { book, status } = req.body;
  if (!book?.googleId) return res.status(400).json({ message: 'book.googleId required' });
  const me = await User.findById(req.user.id);
  const normalized = typeof status === 'string' ? status.toLowerCase() : '';
  if (normalized !== 'read' && normalized !== 'toberead') {
    return res.status(400).json({ message: 'Invalid status. Must be "read" or "toBeRead"' });
  }
  const desiredStatus = normalized === 'read' ? 'read' : 'toBeRead';
  const idx = me.library.findIndex((b) => b.googleId === book.googleId);
  if (idx === -1) {
    me.library.push({ ...book, status: desiredStatus, isRead: desiredStatus === 'read' });
  } else {
    // Update existing entry status to match user selection
    me.library[idx].status = desiredStatus;
    me.library[idx].isRead = desiredStatus === 'read';
  }
  await me.save();
  return res.status(201).json(me.library);
});

router.post('/remove', requireAuth, async (req, res) => {
  const { googleId } = req.body;
  const me = await User.findByIdAndUpdate(
    req.user.id,
    { $pull: { library: { googleId } } },
    { new: true }
  ).select('library');
  return res.json(me.library);
});

router.post('/mark-read', requireAuth, async (req, res) => {
  const { googleId, isRead } = req.body;
  const me = await User.findById(req.user.id);
  const entry = me.library.find((b) => b.googleId === googleId);
  if (!entry) return res.status(404).json({ message: 'Book not in library' });
  entry.isRead = Boolean(isRead);
  entry.status = entry.isRead ? 'read' : 'toBeRead';
  await me.save();
  return res.json(me.library);
});

export default router;
