import { Router } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { signToken } from '../utils/token.js';
import { createDemoUser, getDemoUserByEmail, isMemoryStore, serializeUser } from '../store/demoStore.js';

const router = Router();
const payload = (user) => ({
  token: signToken(user._id),
  user: serializeUser(user)
});

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
    if (isMemoryStore()) {
      if (getDemoUserByEmail(email)) return res.status(409).json({ message: 'That email is already registered' });
      const user = createDemoUser({ name, email, password });
      return res.status(201).json(payload(user));
    }
    const user = await User.create({ name, email, password });
    res.status(201).json(payload(user));
  } catch (error) { next(error); }
});

router.post('/login', async (req, res, next) => {
  try {
    if (isMemoryStore()) {
      const user = getDemoUserByEmail(req.body.email);
      if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        return res.status(401).json({ message: 'Incorrect email or password' });
      }
      return res.json(payload(user));
    }
    const user = await User.findOne({ email: req.body.email }).select('+password');
    if (!user || !(await user.comparePassword(req.body.password))) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }
    res.json(payload(user));
  } catch (error) { next(error); }
});

router.get('/me', protect, (req, res) => {
  res.json({ id: req.user._id, name: req.user.name, email: req.user.email, savedEvents: req.user.savedEvents });
});

export default router;
