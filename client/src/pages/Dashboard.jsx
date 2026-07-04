import { useCallback, useEffect, useState } from 'react';
import { Bookmark, CalendarDays, Edit3, LayoutDashboard, MapPin, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api, { getError } from '../api/client.js';
import { useAuthStore } from '../store/authStore.js';
import EventCard from '../components/EventCard.jsx';
import EventForm from '../components/EventForm.jsx';
import Loader from '../components/Loader.jsx';

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const [tab, setTab] = useState('hosting'); const [events, setEvents] = useState([]); const [saved, setSaved] = useState([]); const [loading, setLoading] = useState(true); const [editing, setEditing] = useState(null); const [formOpen, setFormOpen] = useState(false); const [error, setError] = useState('');
  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { const [mine, savedResult] = await Promise.all([api.get('/events', { params: { mine: user.id } }), api.get('/users/saved')]); setEvents(mine.data.events); setSaved(savedResult.data); }
    catch (e) { setError(getError(e)); } finally { setLoading(false); }
  }, [user.id]);
  useEffect(() => { load(); }, [load]);
  const remove = async (id) => { if (!window.confirm('Delete this event? This cannot be undone.')) return; try { await api.delete(`/events/${id}`); setEvents((items) => items.filter((item) => item._id !== id)); } catch (e) { setError(getError(e)); } };
  const complete = (event) => { setEvents((items) => { const exists = items.some((item) => item._id === event._id); return exists ? items.map((item) => item._id === event._id ? event : item) : [event, ...items]; }); setFormOpen(false); setEditing(null); };
  const removeSaved = (id, isStillSaved) => { if (!isStillSaved) setSaved((items) => items.filter((item) => item._id !== id)); };
  return <div className="dashboard-page"><div className="container">
    <div className="dash-header"><div><span className="overline">Your corner of Evently</span><h1>Welcome, {user.name.split(' ')[0]}</h1><p>Host something wonderful or revisit the events you saved.</p></div><button className="btn btn-primary" onClick={() => { setEditing(null); setFormOpen(true); }}><Plus size={19} /> Create event</button></div>
    <div className="dash-stats"><div><span><CalendarDays /></span><strong>{events.length}</strong><small>Events hosted</small></div><div><span><Bookmark /></span><strong>{saved.length}</strong><small>Events saved</small></div><div><span><LayoutDashboard /></span><strong>{events.filter((e) => new Date(e.date) >= new Date()).length}</strong><small>Coming up</small></div></div>
    <div className="dash-tabs"><button className={tab === 'hosting' ? 'active' : ''} onClick={() => setTab('hosting')}>My events <span>{events.length}</span></button><button className={tab === 'saved' ? 'active' : ''} onClick={() => setTab('saved')}>Saved events <span>{saved.length}</span></button></div>
    {error && <div className="form-error">{error}</div>}
    {loading ? <Loader label="Loading your dashboard..." /> : tab === 'hosting' ? events.length ? <div className="managed-list">{events.map((event) => <div className="managed-event" key={event._id}><div className="managed-date"><strong>{new Date(event.date).getDate()}</strong><span>{new Date(event.date).toLocaleString('en', { month: 'short' })}</span></div><div className="managed-info"><Link to={`/events/${event._id}`}>{event.name}</Link><p><MapPin size={15} /> {event.location} <span>·</span> {event.time}</p></div><span className="status-chip">{new Date(event.date) >= new Date() ? 'Upcoming' : 'Past'}</span><div className="managed-actions"><button onClick={() => { setEditing(event); setFormOpen(true); }}><Edit3 /> <span>Edit</span></button><button className="danger" onClick={() => remove(event._id)}><Trash2 /> <span>Delete</span></button></div></div>)}</div> : <div className="empty-state"><CalendarDays /><h3>Your hosting journey starts here</h3><p>Create an event and give your community a reason to gather.</p><button className="btn btn-primary" onClick={() => setFormOpen(true)}><Plus size={18} /> Create your first event</button></div> : saved.length ? <div className="events-grid">{saved.map((event) => <EventCard key={event._id} event={event} onSaved={removeSaved} />)}</div> : <div className="empty-state"><Bookmark /><h3>No saved events yet</h3><p>Keep interesting plans close by with the bookmark button.</p><Link className="btn btn-primary" to="/events">Explore events</Link></div>}
  </div>{formOpen && <EventForm event={editing} onClose={() => { setFormOpen(false); setEditing(null); }} onSaved={complete} />}</div>;
}
