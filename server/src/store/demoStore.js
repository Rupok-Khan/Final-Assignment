import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { categories } from '../models/Event.js';

const initialUser = () => ({
  _id: 'demo-user-1',
  id: 'demo-user-1',
  name: 'Demo Organizer',
  email: 'demo@evently.com',
  password: bcrypt.hashSync('Demo1234', 12),
  savedEvents: []
});

const buildEvents = () => {
  const addDays = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    date.setHours(12, 0, 0, 0);
    return date;
  };

  return [
    {
      _id: 'demo-event-1',
      id: 'demo-event-1',
      name: 'Dhaka Rooftop Jazz Night',
      date: addDays(5),
      time: '19:30',
      location: 'Dhanmondi, Dhaka',
      category: 'Music',
      price: 12,
      description: 'An intimate evening of live jazz, city lights, and great company.',
      image: '',
      organizer: 'demo-user-1'
    },
    {
      _id: 'demo-event-2',
      id: 'demo-event-2',
      name: 'Build with AI: Creator Meetup',
      date: addDays(9),
      time: '10:00',
      location: 'Banani, Dhaka',
      category: 'Technology',
      price: 0,
      description: 'Meet builders, designers, and curious minds exploring practical AI.',
      image: '',
      organizer: 'demo-user-1'
    },
    {
      _id: 'demo-event-3',
      id: 'demo-event-3',
      name: 'Old Dhaka Street Food Walk',
      date: addDays(13),
      time: '16:30',
      location: 'Lalbagh, Dhaka',
      category: 'Food',
      price: 8,
      description: 'Taste your way through the historic streets of Old Dhaka with a local guide.',
      image: '',
      organizer: 'demo-user-1'
    },
    {
      _id: 'demo-event-4',
      id: 'demo-event-4',
      name: 'Color and Calm: Watercolor Workshop',
      date: addDays(16),
      time: '11:00',
      location: 'Gulshan, Dhaka',
      category: 'Art',
      price: 15,
      description: 'A relaxed beginner-friendly watercolor session. All supplies are included.',
      image: '',
      organizer: 'demo-user-1'
    },
    {
      _id: 'demo-event-5',
      id: 'demo-event-5',
      name: 'Community 5K Sunrise Run',
      date: addDays(20),
      time: '06:00',
      location: 'Hatirjheel, Dhaka',
      category: 'Sports',
      price: 0,
      description: 'Start the day moving with runners of every pace. Friendly and open to all.',
      image: '',
      organizer: 'demo-user-1'
    },
    {
      _id: 'demo-event-6',
      id: 'demo-event-6',
      name: 'Founders and Freelancers Social',
      date: addDays(24),
      time: '18:30',
      location: 'Uttara, Dhaka',
      category: 'Business',
      price: 5,
      description: 'A low-pressure evening for independent professionals and early-stage founders.',
      image: '',
      organizer: 'demo-user-1'
    }
  ];
};

const state = globalThis.__eventlyDemoStore || (globalThis.__eventlyDemoStore = {
  users: [initialUser()],
  events: buildEvents()
});

const toId = (value) => (value?._id || value?.id || value || '').toString();

const cloneUser = (user) => {
  if (!user) return null;
  const source = typeof user.toObject === 'function' ? user.toObject() : user;
  return {
    _id: toId(source),
    id: toId(source),
    name: source.name,
    email: source.email,
    savedEvents: [...(source.savedEvents || [])].map(toId)
  };
};

const organizerView = (organizerId) => {
  const user = state.users.find((item) => toId(item) === toId(organizerId));
  if (!user) return { _id: toId(organizerId), id: toId(organizerId), name: 'Evently host' };
  return { _id: toId(user), id: toId(user), name: user.name, email: user.email };
};

export const isMemoryStore = () => process.env.DATA_STORE === 'memory';

export const serializeUser = (user) => cloneUser(user);

export const serializeEvent = (event) => {
  if (!event) return null;
  const source = typeof event.toObject === 'function' ? event.toObject() : event;
  const organizerId = toId(source.organizer);
  return {
    ...source,
    _id: toId(source),
    id: toId(source),
    organizer: organizerView(organizerId)
  };
};

export const getDemoUserById = (id) => state.users.find((user) => toId(user) === toId(id)) || null;
export const getDemoUserByEmail = (email) => state.users.find((user) => user.email.toLowerCase() === String(email || '').toLowerCase()) || null;

export const createDemoUser = ({ name, email, password }) => {
  const user = {
    _id: randomUUID(),
    id: '',
    name,
    email: email.toLowerCase(),
    password: bcrypt.hashSync(password, 12),
    savedEvents: []
  };
  user.id = user._id;
  state.users.push(user);
  return user;
};

export const listDemoEvents = ({ search, category, location, mine, limit = 30, page = 1 } = {}) => {
  const searchTerm = String(search || '').trim().toLowerCase();
  const locationTerm = String(location || '').trim().toLowerCase();
  const mineId = String(mine || '').trim();

  let events = [...state.events];
  if (searchTerm) {
    events = events.filter((event) =>
      event.name.toLowerCase().includes(searchTerm) || event.description.toLowerCase().includes(searchTerm));
  }
  if (category && category !== 'All') events = events.filter((event) => event.category === category);
  if (locationTerm) events = events.filter((event) => event.location.toLowerCase().includes(locationTerm));
  if (mineId) events = events.filter((event) => toId(event.organizer) === mineId);

  events.sort((a, b) => new Date(a.date) - new Date(b.date));
  const take = Math.min(Number(limit) || 30, 50);
  const currentPage = Math.max(Number(page) || 1, 1);
  const total = events.length;
  const start = (currentPage - 1) * take;
  const pageEvents = events.slice(start, start + take).map(serializeEvent);

  return { events: pageEvents, total, page: currentPage, pages: Math.max(Math.ceil(total / take), 1) };
};

export const getDemoEventById = (id) => serializeEvent(state.events.find((event) => toId(event) === toId(id)));

export const createDemoEvent = (data, organizerId) => {
  const event = {
    _id: randomUUID(),
    id: '',
    name: data.name,
    date: new Date(data.date),
    time: data.time,
    location: data.location,
    category: data.category,
    description: data.description,
    image: data.image || '',
    price: Number(data.price || 0),
    organizer: toId(organizerId)
  };
  event.id = event._id;
  state.events.unshift(event);
  return serializeEvent(event);
};

export const updateDemoEvent = (id, updates, organizerId) => {
  const event = state.events.find((item) => toId(item) === toId(id) && toId(item.organizer) === toId(organizerId));
  if (!event) return null;
  const allowed = ['name', 'date', 'time', 'location', 'category', 'description', 'image', 'price'];
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(updates, key)) {
      event[key] = key === 'date' ? new Date(updates[key]) : key === 'price' ? Number(updates[key] || 0) : updates[key];
    }
  }
  return serializeEvent(event);
};

export const deleteDemoEvent = (id, organizerId) => {
  const index = state.events.findIndex((item) => toId(item) === toId(id) && toId(item.organizer) === toId(organizerId));
  if (index < 0) return null;
  const [event] = state.events.splice(index, 1);
  for (const user of state.users) {
    user.savedEvents = (user.savedEvents || []).filter((savedId) => toId(savedId) !== toId(event));
  }
  return serializeEvent(event);
};

export const getSavedDemoEvents = (userId) => {
  const user = getDemoUserById(userId);
  if (!user) return [];
  return (user.savedEvents || [])
    .map((savedId) => getDemoEventById(savedId))
    .filter(Boolean);
};

export const toggleDemoSavedEvent = (userId, eventId) => {
  const user = getDemoUserById(userId);
  if (!user) return null;
  const event = state.events.find((item) => toId(item) === toId(eventId));
  if (!event) return null;
  const saved = (user.savedEvents || []).some((savedId) => toId(savedId) === toId(eventId));
  user.savedEvents = saved
    ? (user.savedEvents || []).filter((savedId) => toId(savedId) !== toId(eventId))
    : [...(user.savedEvents || []), toId(eventId)];
  return { saved: !saved, eventId: toId(eventId) };
};

export const validateCategory = (category) => categories.includes(category);
