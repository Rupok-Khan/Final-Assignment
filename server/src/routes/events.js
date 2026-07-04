import { Router } from 'express';
import Event from '../models/Event.js';
import { protect } from '../middleware/auth.js';
import {
  createDemoEvent,
  deleteDemoEvent,
  getDemoEventById,
  isMemoryStore,
  listDemoEvents,
  updateDemoEvent,
  validateCategory
} from '../store/demoStore.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    if (isMemoryStore()) {
      const result = listDemoEvents(req.query);
      return res.json(result);
    }
    const { search, category, location, mine, limit = 30, page = 1 } = req.query;
    const query = {};
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
    if (category && category !== 'All') query.category = category;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (mine) query.organizer = mine;
    const take = Math.min(Number(limit), 50);
    const [events, total] = await Promise.all([
      Event.find(query).populate('organizer', 'name').sort({ date: 1 }).skip((Number(page) - 1) * take).limit(take),
      Event.countDocuments(query)
    ]);
    res.json({ events, total, page: Number(page), pages: Math.ceil(total / take) });
  } catch (error) { next(error); }
});

router.get('/:id', async (req, res, next) => {
  try {
    if (isMemoryStore()) {
      const event = getDemoEventById(req.params.id);
      if (!event) return res.status(404).json({ message: 'Event not found' });
      return res.json(event);
    }
    const event = await Event.findById(req.params.id).populate('organizer', 'name email');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) { next(error); }
});

router.post('/', protect, async (req, res, next) => {
  try {
    if (!validateCategory(req.body.category)) {
      return res.status(400).json({ message: 'Please choose a valid category' });
    }
    if (isMemoryStore()) {
      const event = createDemoEvent(req.body, req.user._id);
      return res.status(201).json(event);
    }
    const event = await Event.create({ ...req.body, organizer: req.user._id });
    res.status(201).json(event);
  } catch (error) { next(error); }
});

router.put('/:id', protect, async (req, res, next) => {
  try {
    if (req.body.category && !validateCategory(req.body.category)) {
      return res.status(400).json({ message: 'Please choose a valid category' });
    }
    if (isMemoryStore()) {
      const event = updateDemoEvent(req.params.id, req.body, req.user._id);
      if (!event) return res.status(404).json({ message: 'Event not found or you are not its owner' });
      return res.json(event);
    }
    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, organizer: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!event) return res.status(404).json({ message: 'Event not found or you are not its owner' });
    res.json(event);
  } catch (error) { next(error); }
});

router.delete('/:id', protect, async (req, res, next) => {
  try {
    if (isMemoryStore()) {
      const event = deleteDemoEvent(req.params.id, req.user._id);
      if (!event) return res.status(404).json({ message: 'Event not found or you are not its owner' });
      return res.json({ message: 'Event deleted' });
    }
    const event = await Event.findOneAndDelete({ _id: req.params.id, organizer: req.user._id });
    if (!event) return res.status(404).json({ message: 'Event not found or you are not its owner' });
    await req.user.updateOne({ $pull: { savedEvents: event._id } });
    res.json({ message: 'Event deleted' });
  } catch (error) { next(error); }
});

export default router;
