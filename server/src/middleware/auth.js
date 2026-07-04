import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { getDemoUserById, isMemoryStore } from '../store/demoStore.js';

export async function protect(req, res, next) {
  try {
    const token = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null;
    if (!token) return res.status(401).json({ message: 'Please log in to continue' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (isMemoryStore()) {
      req.user = getDemoUserById(decoded.id);
      if (!req.user) return res.status(401).json({ message: 'User no longer exists' });
      return next();
    }
    req.user = await User.findById(decoded.id);
    if (!req.user) return res.status(401).json({ message: 'User no longer exists' });
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired session' });
  }
}
