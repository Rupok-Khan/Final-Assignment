import { createElement, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CalendarCheck, MapPin, Search, Sparkles, TicketCheck, Users, Music, Cpu, Utensils, Palette, Trophy, BriefcaseBusiness, HeartHandshake } from 'lucide-react';
import api from '../api/client.js';
import EventCard from '../components/EventCard.jsx';
import Loader from '../components/Loader.jsx';

const categories = [
  ['Music', Music, '#ffe7ef'], ['Technology', Cpu, '#e6e8ff'], ['Food', Utensils, '#fff0dc'], ['Art', Palette, '#e5f7ef'],
  ['Sports', Trophy, '#e3f3ff'], ['Business', BriefcaseBusiness, '#f2e7ff'], ['Community', HeartHandshake, '#ffeddf']
];

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();
  useEffect(() => { api.get('/events?limit=6').then(({ data }) => setEvents(data.events)).finally(() => setLoading(false)); }, []);
  const submit = (e) => { e.preventDefault(); navigate(`/events?search=${encodeURIComponent(search)}&location=${encodeURIComponent(location)}`); };
  return <>
    <section className="hero"><div className="hero-orb orb-one" /><div className="hero-orb orb-two" /><div className="container hero-content">
      <p className="hero-kicker"><Sparkles size={16} /> Your city is happening</p>
      <h1>Find your next<br /><em>unforgettable</em> moment.</h1>
      <p className="hero-copy">Concerts, workshops, meetups, and hidden gems—discover experiences worth showing up for.</p>
      <form className="search-box" onSubmit={submit}>
        <label><Search size={20} /><span><small>What</small><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search events" /></span></label>
        <label><MapPin size={20} /><span><small>Where</small><input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City or venue" /></span></label>
        <button className="btn btn-primary" type="submit">Explore events <ArrowRight size={18} /></button>
      </form>
      <div className="hero-proof"><span><Users /> 12k+ explorers</span><span><CalendarCheck /> Fresh events weekly</span><span><TicketCheck /> Free to discover</span></div>
    </div></section>

    <section className="section container"><div className="section-heading"><div><span className="overline">Something for everyone</span><h2>Browse by category</h2></div><Link to="/events" className="text-link">View all <ArrowRight size={17} /></Link></div>
      <div className="category-grid">{categories.map(([name, icon, color]) => <Link key={name} to={`/events?category=${name}`} className="category-card" style={{ '--cat-color': color }}><span>{createElement(icon)}</span><strong>{name}</strong><small>Explore events</small><ArrowRight className="cat-arrow" size={18} /></Link>)}</div>
    </section>

    <section className="section section-tint"><div className="container"><div className="section-heading"><div><span className="overline">Save the date</span><h2>Events coming up</h2></div><Link to="/events" className="text-link">Explore all <ArrowRight size={17} /></Link></div>
      {loading ? <Loader /> : events.length ? <div className="events-grid">{events.map((event) => <EventCard key={event._id} event={event} />)}</div> : <div className="empty-state"><CalendarCheck /><h3>The calendar is waiting</h3><p>Be the first to bring an event to your community.</p><Link className="btn btn-primary" to="/dashboard">Create an event</Link></div>}
    </div></section>

    <section className="container host-cta"><div><span className="overline overline-light">Bring people together</span><h2>Have an idea worth gathering for?</h2><p>Create your event in minutes and share it with people ready to show up.</p></div><Link to="/dashboard" className="btn btn-light">Start hosting <ArrowRight size={18} /></Link></section>
  </>;
}
