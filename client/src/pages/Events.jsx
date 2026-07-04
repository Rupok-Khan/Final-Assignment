import { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import api, { getError } from '../api/client.js';
import EventCard from '../components/EventCard.jsx';
import Loader from '../components/Loader.jsx';

const categories = ['All', 'Music', 'Technology', 'Food', 'Art', 'Sports', 'Business', 'Community'];

export default function Events() {
  const [params, setParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const search = params.get('search') || '';
  const location = params.get('location') || '';
  const category = params.get('category') || 'All';
  const update = (key, value) => { const next = new URLSearchParams(params); value && value !== 'All' ? next.set(key, value) : next.delete(key); setParams(next); };
  useEffect(() => {
    setLoading(true); setError('');
    api.get('/events', { params: Object.fromEntries(params) }).then(({ data }) => setEvents(data.events)).catch((e) => setError(getError(e))).finally(() => setLoading(false));
  }, [params]);
  return <div className="page container">
    <div className="page-heading"><span className="overline">Make plans</span><h1>Explore events</h1><p>Search the city, follow your curiosity, and find something worth remembering.</p></div>
    <div className="filter-panel"><div className="filter-input"><Search /><input value={search} onChange={(e) => update('search', e.target.value)} placeholder="Search by event name" /></div><div className="filter-input"><SlidersHorizontal /><input value={location} onChange={(e) => update('location', e.target.value)} placeholder="Filter by location" /></div>{(search || location || category !== 'All') && <button className="clear-btn" onClick={() => setParams({})}><X size={17} /> Clear</button>}</div>
    <div className="category-tabs">{categories.map((item) => <button className={category === item ? 'active' : ''} onClick={() => update('category', item)} key={item}>{item}</button>)}</div>
    {loading ? <Loader /> : error ? <div className="empty-state"><h3>We couldn't load events</h3><p>{error}</p></div> : events.length ? <><p className="result-count">{events.length} event{events.length !== 1 ? 's' : ''} found</p><div className="events-grid">{events.map((event) => <EventCard key={event._id} event={event} />)}</div></> : <div className="empty-state"><Search /><h3>No events found</h3><p>Try a broader search or another category.</p><button className="btn btn-primary" onClick={() => setParams({})}>Reset filters</button></div>}
  </div>;
}
