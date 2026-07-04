import mongoose from 'mongoose';

export const categories = ['Music', 'Technology', 'Food', 'Art', 'Sports', 'Business', 'Community'];

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  date: { type: Date, required: true, index: true },
  time: { type: String, required: true },
  location: { type: String, required: true, trim: true, index: true },
  category: { type: String, required: true, enum: categories, index: true },
  description: { type: String, required: true, trim: true, maxlength: 3000 },
  image: { type: String, default: '' },
  price: { type: Number, default: 0, min: 0 },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }
}, { timestamps: true });

export default mongoose.model('Event', eventSchema);
