import { Link } from 'react-router-dom';
export default function NotFound() { return <div className="page container empty-state"><strong className="error-code">404</strong><h1>This event left early.</h1><p>The page you're looking for isn't on the guest list.</p><Link className="btn btn-primary" to="/">Back home</Link></div>; }
