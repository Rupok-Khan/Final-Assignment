import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { getSavedDemoEvents, isMemoryStore, toggleDemoSavedEvent } from '../store/demoStore.js';

const router = Router();

router.get('/saved', protect, async (req, res, next) => {
  try {
    if (isMemoryStore()) {
      return res.json(getSavedDemoEvents(req.user._id));
    }
    await req.user.populate({ path: 'savedEvents', populate: { path: 'organizer', select: 'name' } });
    res.json(req.user.savedEvents);
  } catch (error) { next(error); }
});

router.patch('/saved/:eventId', protect, async (req, res, next) => {
  try {
    if (isMemoryStore()) {
      const result = toggleDemoSavedEvent(req.user._id, req.params.eventId);
      if (!result) return res.status(404).json({ message: 'Event not found' });
      return res.json(result);
    }
    const id = req.params.eventId;
    const saved = req.user.savedEvents.some((eventId) => eventId.toString() === id);
    await req.user.updateOne(saved ? { $pull: { savedEvents: id } } : { $addToSet: { savedEvents: id } });
    res.json({ saved: !saved, eventId: id });
  } catch (error) { next(error); }
});

export default router;
