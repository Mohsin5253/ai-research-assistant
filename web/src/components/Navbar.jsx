import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Brain, Menu, X, User as UserIcon, LogOut } from 'lucide-react';
import { useState } from 'react';

export default function Navbar({ currentUser, onLoginClick, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/features', label: 'Features' },
    { to: '/how-it-works', label: 'How It Works' },
    { to: '/blog', label: 'Blog' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/" className="logo" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Brain className="logo-icon" size={28} />
          <span>Nexus<span className="text-gradient">AI</span></span>
        </Link>

        {/* Desktop Nav */}
        <div className="nav-links" style={{ display: 'flex', gap: '2rem' }}>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="nav-link"
              style={{
                color: location.pathname === link.to ? 'var(--accent-primary)' : undefined,
                borderBottom: location.pathname === link.to ? '2px solid var(--accent-primary)' : '2px solid transparent',
                paddingBottom: '2px'
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {currentUser ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                <UserIcon size={16} />
                <span className="hide-mobile">{currentUser.email.split('@')[0]}</span>
              </div>
              <button onClick={() => { navigate('/research'); }} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                Research
              </button>
              <button onClick={onLogout} className="btn btn-outline" style={{ padding: '0.5rem 0.75rem' }}>
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => onLoginClick(true)} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                Log In
              </button>
              <button onClick={() => { onLoginClick(false); }} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                Get Started
              </button>
            </>
          )}

          {/* Mobile hamburger */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu" style={{
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-subtle)',
          padding: '1rem',
        }}>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="nav-link"
              onClick={() => setMenuOpen(false)}
              style={{ display: 'block', padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-subtle)' }}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            {currentUser ? (
              <button onClick={() => { onLogout(); setMenuOpen(false); }} className="btn btn-outline" style={{ flex: 1 }}>
                Logout
              </button>
            ) : (
              <>
                <button onClick={() => { onLoginClick(true); setMenuOpen(false); }} className="btn btn-outline" style={{ flex: 1 }}>Log In</button>
                <button onClick={() => { onLoginClick(false); setMenuOpen(false); }} className="btn btn-primary" style={{ flex: 1 }}>Sign Up</button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
