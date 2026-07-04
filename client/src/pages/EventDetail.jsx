import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Bookmark, CalendarDays, Clock, MapPin, Share2, UserRound } from 'lucide-react';
import api, { getError } from '../api/client.js';
import { eventImage, formatDate } from '../utils/event.js';
import Loader from '../components/Loader.jsx';
import { useAuthStore } from '../store/authStore.js';

export default function EventDetail() {
  const { id } = useParams(); const navigate = useNavigate();
  const [event, setEvent] = useState(null); const [error, setError] = useState(''); const [copied, setCopied] = useState(false);
  const { user, isSaved, toggleSaved } = useAuthStore();
  useEffect(() => { api.get(`/events/${id}`).then(({ data }) => setEvent(data)).catch((e) => setError(getError(e))); }, [id]);
  if (error) return <div className="page container empty-state"><h2>Event unavailable</h2><p>{error}</p><Link className="btn btn-primary" to="/events">Browse events</Link></div>;
  if (!event) return <div className="page container"><Loader /></div>;
  const saved = isSaved(event._id);
  const save = async () => { if (!user) return navigate('/login'); await toggleSaved(event._id); };
  const share = async () => { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1800); };
  return <div className="detail-page"><div className="container"><Link to="/events" className="back-link"><ArrowLeft size={17} /> Back to events</Link>
    <div className="detail-visual"><img src={eventImage(event)} alt={event.name} /><span className="category-pill detail-pill">{event.category}</span></div>
    <div className="detail-layout"><article><p className="eyebrow">{formatDate(event.date)} · {event.time}</p><h1>{event.name}</h1><p className="detail-description">{event.description}</p><hr /><h3>Hosted by</h3><div className="host"><span><UserRound /></span><div><strong>{event.organizer?.name || 'Evently host'}</strong><small>Community organizer</small></div></div></article>
      <aside className="detail-card"><h3>Event details</h3><div className="detail-row"><CalendarDays /><span><small>Date</small><strong>{formatDate(event.date)}</strong></span></div><div className="detail-row"><Clock /><span><small>Time</small><strong>{event.time}</strong></span></div><div className="detail-row"><MapPin /><span><small>Location</small><strong>{event.location}</strong></span></div><div className="price-line"><span>Entry</span><strong>{event.price ? `$${event.price}` : 'Free'}</strong></div><button onClick={save} className={saved ? 'btn btn-primary btn-wide' : 'btn btn-dark btn-wide'}><Bookmark size={18} fill={saved ? 'currentColor' : 'none'} />{saved ? 'Saved to your events' : 'Save this event'}</button><button onClick={share} className="btn btn-ghost btn-wide"><Share2 size={18} />{copied ? 'Link copied!' : 'Share event'}</button></aside>
    </div></div></div>;
}
