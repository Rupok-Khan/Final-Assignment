import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import api, { getError } from '../api/client.js';

const blank = { name: '', date: '', time: '', location: '', category: 'Music', description: '', image: '', price: 0 };
const categories = ['Music', 'Technology', 'Food', 'Art', 'Sports', 'Business', 'Community'];

export default function EventForm({ event, onClose, onSaved }) {
  const [form, setForm] = useState(blank); const [loading, setLoading] = useState(false); const [error, setError] = useState('');
  useEffect(() => { if (event) setForm({ ...blank, ...event, date: new Date(event.date).toISOString().split('T')[0] }); }, [event]);
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try { const { data } = event ? await api.put(`/events/${event._id}`, form) : await api.post('/events', form); onSaved(data); }
    catch (err) { setError(getError(err)); setLoading(false); }
  };
  return <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><div className="event-modal"><button className="modal-close" onClick={onClose}><X /></button><span className="overline">{event ? 'Make a change' : 'Bring people together'}</span><h2>{event ? 'Edit event' : 'Create a new event'}</h2><p>Give people the details they need to show up.</p>
    {error && <div className="form-error">{error}</div>}
    <form className="event-form" onSubmit={submit}>
      <label className="form-field form-full"><span>Event name *</span><input name="name" required maxLength="120" value={form.name} onChange={change} placeholder="e.g. Sunset Jazz on the Roof" /></label>
      <label className="form-field"><span>Date *</span><input name="date" required type="date" value={form.date} min={new Date().toISOString().split('T')[0]} onChange={change} /></label>
      <label className="form-field"><span>Time *</span><input name="time" required type="time" value={form.time} onChange={change} /></label>
      <label className="form-field"><span>Category *</span><select name="category" value={form.category} onChange={change}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label className="form-field"><span>Price ($)</span><input name="price" min="0" step="0.01" type="number" value={form.price} onChange={change} /></label>
      <label className="form-field form-full"><span>Location *</span><input name="location" required value={form.location} onChange={change} placeholder="Venue, neighborhood, or full address" /></label>
      <label className="form-field form-full"><span>Image URL</span><input name="image" type="url" value={form.image} onChange={change} placeholder="https://... (optional)" /></label>
      <label className="form-field form-full"><span>Description *</span><textarea name="description" required maxLength="3000" rows="5" value={form.description} onChange={change} placeholder="What makes this event special? What should guests expect?" /></label>
      <div className="form-actions form-full"><button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button><button disabled={loading} className="btn btn-primary" type="submit">{loading ? 'Saving...' : event ? 'Save changes' : 'Publish event'}</button></div>
    </form>
  </div></div>;
}
