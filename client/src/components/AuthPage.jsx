import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, CalendarHeart, Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { useAuthStore } from '../store/authStore.js';
import { getError } from '../api/client.js';

export default function AuthPage({ mode }) {
  const isLogin = mode === 'login'; const navigate = useNavigate(); const location = useLocation();
  const { user, login, register, loading } = useAuthStore();
  const [form, setForm] = useState({ name: '', email: '', password: '' }); const [show, setShow] = useState(false); const [error, setError] = useState('');
  if (user) return <Navigate to="/dashboard" replace />;
  const submit = async (e) => { e.preventDefault(); setError(''); try { await (isLogin ? login({ email: form.email, password: form.password }) : register(form)); navigate(location.state?.from || '/dashboard'); } catch (err) { setError(getError(err)); } };
  return <div className="auth-page"><div className="auth-art"><Link to="/" className="logo logo-light"><span><CalendarHeart /></span>evently</Link><div><p className="hero-kicker"><CalendarHeart size={16} /> Moments start here</p><h2>{isLogin ? 'Good to see you again.' : 'Your next great story starts nearby.'}</h2><p>{isLogin ? 'Your saved plans and hosted events are right where you left them.' : 'Join thousands finding new people, places, and possibilities.'}</p></div><small>Discover. Gather. Remember.</small></div>
    <div className="auth-form-wrap"><form className="auth-form" onSubmit={submit}><span className="overline">{isLogin ? 'Welcome back' : 'Join the community'}</span><h1>{isLogin ? 'Log in to Evently' : 'Create your account'}</h1><p>{isLogin ? "New around here?" : 'Already have an account?'} <Link to={isLogin ? '/register' : '/login'}>{isLogin ? 'Create an account' : 'Log in'}</Link></p>
      {error && <div className="form-error">{error}</div>}
      {!isLogin && <label className="form-field"><span>Full name</span><div><UserRound /><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Alex Morgan" /></div></label>}
      <label className="form-field"><span>Email address</span><div><Mail /><input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></div></label>
      <label className="form-field"><span>Password</span><div><LockKeyhole /><input required minLength="6" type={show ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 6 characters" /><button type="button" onClick={() => setShow(!show)}>{show ? <EyeOff /> : <Eye />}</button></div></label>
      <button disabled={loading} className="btn btn-primary btn-wide" type="submit">{loading ? 'Just a moment...' : isLogin ? 'Log in' : 'Create account'} {!loading && <ArrowRight size={18} />}</button>
      <p className="legal">By continuing, you agree to Evently's Terms and Privacy Policy.</p>
    </form></div>
  </div>;
}
