import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { CalendarHeart, Menu, X, Instagram, Facebook, Linkedin } from 'lucide-react';
import { useAuthStore } from '../store/authStore.js';

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const close = () => setOpen(false);
  return <div className="site-shell">
    <header className="header"><div className="container nav-wrap">
      <Link to="/" className="logo" onClick={close}><span><CalendarHeart size={23} /></span>evently</Link>
      <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X /> : <Menu />}</button>
      <nav className={open ? 'nav open' : 'nav'}>
        <NavLink to="/" onClick={close}>Home</NavLink><NavLink to="/events" onClick={close}>Explore</NavLink>
        {user && <NavLink to="/dashboard" onClick={close}>Dashboard</NavLink>}
        <div className="nav-actions">{user ? <>
          <span className="hello">Hi, {user.name.split(' ')[0]}</span>
          <button className="btn btn-ghost" onClick={() => { logout(); close(); navigate('/'); }}>Log out</button>
        </> : <><Link to="/login" className="btn btn-ghost" onClick={close}>Log in</Link><Link to="/register" className="btn btn-primary btn-small" onClick={close}>Join Evently</Link></>}</div>
      </nav>
    </div></header>
    <main><Outlet /></main>
    <footer className="footer"><div className="container footer-grid">
      <div><Link to="/" className="logo logo-light"><span><CalendarHeart size={23} /></span>evently</Link><p>Find the moments that make your city feel like home.</p></div>
      <div><h4>Discover</h4><Link to="/events">All events</Link><Link to="/events?category=Music">Live music</Link><Link to="/events?category=Technology">Technology</Link></div>
      <div><h4>Evently</h4><Link to="/dashboard">Create an event</Link><Link to="/register">Create account</Link><a href="mailto:hello@evently.com">Contact us</a></div>
      <div><h4>Stay connected</h4><div className="socials"><a href="#" aria-label="Instagram"><Instagram /></a><a href="#" aria-label="Facebook"><Facebook /></a><a href="#" aria-label="LinkedIn"><Linkedin /></a></div></div>
    </div><div className="container copyright">© {new Date().getFullYear()} Evently. Made for memorable days.</div></footer>
  </div>;
}
