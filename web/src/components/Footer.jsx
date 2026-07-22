import { Link } from 'react-router-dom';
import { Brain } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-col">
            <div className="logo" style={{ marginBottom: '1rem' }}>
              <Brain className="logo-icon" size={24} />
              <span>Nexus<span className="text-gradient">AI</span></span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: '280px', lineHeight: '1.6' }}>
              Pioneering the next generation of autonomous research through advanced multi-agent architectures.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem' }}>
              <a href="#" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s', fontSize: '0.875rem' }}
                onMouseEnter={e => e.target.style.color = 'var(--accent-primary)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
              >Twitter</a>
              <a href="#" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s', fontSize: '0.875rem' }}
                onMouseEnter={e => e.target.style.color = 'var(--accent-primary)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
              >GitHub</a>
              <a href="#" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s', fontSize: '0.875rem' }}
                onMouseEnter={e => e.target.style.color = 'var(--accent-primary)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
              >LinkedIn</a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Product</h4>
            <div className="footer-links">
              <Link to="/features">Features</Link>
              <Link to="/how-it-works">How It Works</Link>
              <Link to="/research">Try Research</Link>
              <Link to="/api-docs">API Docs</Link>
            </div>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <div className="footer-links">
              <Link to="/about">About Us</Link>
              <Link to="/careers">Careers</Link>
              <Link to="/blog">Blog</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>

          <div className="footer-col">
            <h4>Legal</h4>
            <div className="footer-links">
              <Link to="/legal/privacy">Privacy Policy</Link>
              <Link to="/legal/terms">Terms of Service</Link>
              <Link to="/legal/cookies">Cookie Policy</Link>
              <Link to="/legal/security">Security</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} NexusAI Research Systems. All rights reserved.</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Built with ❤️ and multi-agent intelligence</p>
        </div>
      </div>
    </footer>
  );
}
