import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { User } from '../models/User.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  const me = await User.findById(req.user.id).populate('friends', 'username profilePic');
  return res.json(me?.friends || []);
});

// List pending friend requests
router.get('/requests', requireAuth, async (req, res) => {
  const me = await User.findById(req.user.id).populate({
    path: 'friendRequests.from',
    select: 'username profilePic'
  });
  const pending = (me?.friendRequests || []).filter((r) => r.status === 'pending').map((r) => ({
    fromUserId: r.from._id,
    username: r.from.username,
    profilePic: r.from.profilePic,
    requestedAt: r.createdAt
  }));
  return res.json(pending);
});

router.post('/request/:userId', requireAuth, async (req, res) => {
  const targetId = req.params.userId;
  if (targetId === req.user.id) return res.status(400).json({ message: 'Cannot friend yourself' });
  const target = await User.findById(targetId);
  if (!target) return res.status(404).json({ message: 'User not found' });
  target.friendRequests.push({ from: req.user.id });
  await target.save();
  return res.json({ message: 'Request sent' });
});

router.post('/accept/:fromUserId', requireAuth, async (req, res) => {
  const fromId = req.params.fromUserId;
  const me = await User.findById(req.user.id);
  const reqIndex = me.friendRequests.findIndex((r) => r.from.toString() === fromId && r.status === 'pending');
  if (reqIndex === -1) return res.status(404).json({ message: 'Request not found' });
  me.friendRequests[reqIndex].status = 'accepted';
  me.friends.addToSet(fromId);
  const other = await User.findById(fromId);
  other.friends.addToSet(me._id);
  await Promise.all([me.save(), other.save()]);
  return res.json({ message: 'Friend added' });
});

// Reject a pending friend request
router.post('/reject/:fromUserId', requireAuth, async (req, res) => {
  const fromId = req.params.fromUserId;
  const me = await User.findById(req.user.id);
  const reqIndex = me.friendRequests.findIndex((r) => r.from.toString() === fromId && r.status === 'pending');
  if (reqIndex === -1) return res.status(404).json({ message: 'Request not found' });
  me.friendRequests[reqIndex].status = 'rejected';
  await me.save();
  return res.json({ message: 'Request rejected' });
});

// View a friend's library
router.get('/:friendId/library', requireAuth, async (req, res) => {
  const friendId = req.params.friendId;
  const me = await User.findById(req.user.id);
  const isFriend = me.friends.some((f) => f.toString() === friendId);
  if (!isFriend) return res.status(403).json({ message: 'Not friends' });
  const friend = await User.findById(friendId).select('username profilePic library');
  return res.json(friend);
});

export default router;

