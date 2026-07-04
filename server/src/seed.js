import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import Event from './models/Event.js';
import { createDemoUser, getDemoUserByEmail, isMemoryStore, listDemoEvents } from './store/demoStore.js';

const addDays = (days) => { const date = new Date(); date.setDate(date.getDate() + days); date.setHours(12, 0, 0, 0); return date; };

const samples = [
  { name: 'Dhaka Rooftop Jazz Night', date: addDays(5), time: '19:30', location: 'Dhanmondi, Dhaka', category: 'Music', price: 12, description: 'An intimate evening of live jazz, city lights, and great company. Local musicians bring classic standards and new sounds to a beautiful open-air rooftop.' },
  { name: 'Build with AI: Creator Meetup', date: addDays(9), time: '10:00', location: 'Banani, Dhaka', category: 'Technology', price: 0, description: 'Meet builders, designers, and curious minds exploring practical AI. Expect quick demos, honest conversations, and plenty of time to connect.' },
  { name: 'Old Dhaka Street Food Walk', date: addDays(13), time: '16:30', location: 'Lalbagh, Dhaka', category: 'Food', price: 8, description: 'Taste your way through the historic streets of Old Dhaka with a local guide. Discover beloved classics, family-run stalls, and the stories behind each dish.' },
  { name: 'Color & Calm: Watercolor Workshop', date: addDays(16), time: '11:00', location: 'Gulshan, Dhaka', category: 'Art', price: 15, description: 'A relaxed beginner-friendly watercolor session. All supplies are included—just bring your curiosity and leave with something you made by hand.' },
  { name: 'Community 5K Sunrise Run', date: addDays(20), time: '06:00', location: 'Hatirjheel, Dhaka', category: 'Sports', price: 0, description: 'Start the day moving with runners of every pace. This friendly community 5K is about fresh air and shared momentum, not finish times.' },
  { name: 'Founders & Freelancers Social', date: addDays(24), time: '18:30', location: 'Uttara, Dhaka', category: 'Business', price: 5, description: 'A low-pressure evening for independent professionals and early-stage founders to exchange ideas, lessons, and useful introductions.' }
];

try {
  await connectDB();
  if (isMemoryStore()) {
    const existing = getDemoUserByEmail('demo@evently.com');
    if (!existing) createDemoUser({ name: 'Demo Organizer', email: 'demo@evently.com', password: 'Demo1234' });
    console.log(`Demo in-memory store ready with ${listDemoEvents().total} events.`);
    process.exitCode = 0;
  } else {
  let user = await User.findOne({ email: 'demo@evently.com' });
  if (!user) user = await User.create({ name: 'Demo Organizer', email: 'demo@evently.com', password: 'Demo1234' });
  await Event.deleteMany({ organizer: user._id });
  await Event.insertMany(samples.map((event) => ({ ...event, organizer: user._id })));
  console.log('Demo account and events created.');
  }
} catch (error) { console.error(error); process.exitCode = 1; } finally { if (mongoose.connection.readyState) await mongoose.disconnect(); }
