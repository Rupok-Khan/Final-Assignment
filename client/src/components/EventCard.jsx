import { Link, useNavigate } from 'react-router-dom';
import { Bookmark, CalendarDays, MapPin } from 'lucide-react';
import { useAuthStore } from '../store/authStore.js';
import { eventImage, formatDate } from '../utils/event.js';

export default function EventCard({ event, onSaved }) {
  const navigate = useNavigate();
  const { user, isSaved, toggleSaved } = useAuthStore();
  const saved = isSaved(event._id);
  const save = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    const value = await toggleSaved(event._id);
    onSaved?.(event._id, value);
  };
  return <Link to={`/events/${event._id}`} className="event-card">
    <div className="card-image"><img src={eventImage(event)} alt="" /><span className="category-pill">{event.category}</span><button className={saved ? 'save-btn saved' : 'save-btn'} onClick={save} aria-label="Save event"><Bookmark size={19} fill={saved ? 'currentColor' : 'none'} /></button></div>
    <div className="card-content"><p className="eyebrow"><CalendarDays size={15} /> {formatDate(event.date)} · {event.time}</p><h3>{event.name}</h3><p className="location"><MapPin size={16} />{event.location}</p><div className="card-bottom"><span>{event.price ? `$${event.price}` : 'Free'}</span><span>View event →</span></div></div>
  </Link>;
}
