import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

// Pages
import Home from './pages/Home';
import Research from './pages/Research';
import About from './pages/About';
import Features from './pages/Features';
import HowItWorks from './pages/HowItWorks';
import Blog from './pages/Blog';
import Careers from './pages/Careers';
import Contact from './pages/Contact';
import Legal from './pages/Legal';
import ApiDocs from './pages/ApiDocs';
import ApiKeys from './pages/ApiKeys';
import SharedReport from './pages/SharedReport';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('nexus_token'));
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem('nexus_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [showAuth, setShowAuth] = useState(false);
  const [authDefaultView, setAuthDefaultView] = useState('login');

  // Restore/validate session on load
  useEffect(() => {
    if (token) {
      const API_URL = import.meta.env.VITE_API_URL || 'https://ai-research-assistant-2zmw.onrender.com';
      fetch(`${API_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => {
          if (res.status === 401) {
            // Token is invalid/expired — clear session
            handleLogout();
            return null;
          }
          if (!res.ok) {
            // Server error (5xx) — keep cached user, don't logout
            return null;
          }
          return res.json();
        })
        .then(data => {
          if (data) {
            setCurrentUser(data);
            localStorage.setItem('nexus_user', JSON.stringify(data));
          }
        })
        .catch(() => {
          // Network error (backend unreachable) — keep cached user
          // Don't logout; the token may still be valid
        });
    }
  }, [token]);

  const handleAuthSuccess = (newToken, user) => {
    localStorage.setItem('nexus_token', newToken);
    localStorage.setItem('nexus_user', JSON.stringify(user));
    setToken(newToken);
    setCurrentUser(user);
    setShowAuth(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('nexus_token');
    localStorage.removeItem('nexus_user');
    setToken(null);
    setCurrentUser(null);
  };

  // login=true by default, login=false means show signup
  const openAuth = (isLogin = true) => {
    setAuthDefaultView(isLogin ? 'login' : 'signup');
    setShowAuth(true);
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar
          currentUser={currentUser}
          onLoginClick={openAuth}
          onLogout={handleLogout}
        />

        {showAuth && (
          <AuthModal
            defaultView={authDefaultView}
            onClose={() => setShowAuth(false)}
            onSuccess={handleAuthSuccess}
          />
        )}

        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home currentUser={currentUser} onLoginClick={openAuth} />} />
            <Route path="/research" element={<Research currentUser={currentUser} token={token} onLoginClick={openAuth} />} />
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/legal/:document" element={<Legal />} />
            <Route path="/api-docs" element={<ApiDocs />} />
            <Route path="/api-keys" element={<ApiKeys currentUser={currentUser} token={token} onLoginClick={openAuth} />} />
            <Route path="/share/:slug" element={<SharedReport />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
