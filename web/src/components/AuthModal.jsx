import { useState } from 'react';
import { Brain, X, Loader2 } from 'lucide-react';

export default function AuthModal({ onClose, onSuccess, defaultView = 'login' }) {
  const [isLoginView, setIsLoginView] = useState(defaultView === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Password length validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    try {
      const endpoint = isLoginView ? '/api/auth/login' : '/api/auth/register';
      let body, headers;

      if (isLoginView) {
        const params = new URLSearchParams();
        params.append('username', email);
        params.append('password', password);
        body = params.toString();
        headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
      } else {
        body = JSON.stringify({ email, password });
        headers = { 'Content-Type': 'application/json' };
      }

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}${endpoint}`, { method: 'POST', headers, body });
      const data = await response.json();

      if (!response.ok) throw new Error(data.detail || 'Authentication failed');

      localStorage.setItem('nexus_token', data.access_token);
      onSuccess(data.access_token, data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 9999, background: 'rgba(3,7,18,0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div className="glass-panel animate-fade-in" style={{
        padding: 'clamp(1.5rem, 5vw, 2.5rem)',
        width: '100%', maxWidth: '420px',
        position: 'relative', borderRadius: '1.5rem',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '1.25rem', right: '1.25rem',
          background: 'none', border: 'none', color: 'var(--text-secondary)',
          cursor: 'pointer', padding: '0.25rem',
        }}>
          <X size={22} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
          }}>
            <Brain size={32} color="white" />
          </div>
          <h2 style={{ marginBottom: '0.5rem', fontSize: 'clamp(1.25rem, 4vw, 1.75rem)' }}>
            {isLoginView ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {isLoginView ? 'Sign in to access NexusAI research.' : 'Join to unlock multi-agent research.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="email" required
            placeholder="Email Address"
            value={email} onChange={e => setEmail(e.target.value)}
            style={{
              padding: '0.875rem 1rem', borderRadius: '0.75rem',
              border: '1px solid var(--border-subtle)',
              background: 'rgba(255,255,255,0.05)',
              color: 'white', fontSize: '0.95rem', outline: 'none',
              width: '100%', boxSizing: 'border-box',
            }}
          />
          <input
            type="password" required
            placeholder="Password"
            value={password} onChange={e => setPassword(e.target.value)}
            style={{
              padding: '0.875rem 1rem', borderRadius: '0.75rem',
              border: '1px solid var(--border-subtle)',
              background: 'rgba(255,255,255,0.05)',
              color: 'white', fontSize: '0.95rem', outline: 'none',
              width: '100%', boxSizing: 'border-box',
            }}
          />

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '0.5rem', padding: '0.75rem 1rem',
              color: '#f87171', fontSize: '0.875rem',
            }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '0.875rem', marginTop: '0.25rem', fontSize: '1rem' }}>
            {loading ? <><Loader2 size={18} className="animate-spin" />&nbsp; Please wait...</> : (isLoginView ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          {isLoginView ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setIsLoginView(!isLoginView); setError(null); }}
            style={{ color: 'var(--accent-primary)', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer' }}>
            {isLoginView ? 'Sign Up Free' : 'Log In'}
          </button>
        </div>
      </div>
    </div>
  );
}
