import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Network, Zap, Database, Lock, BarChart, ArrowRight, ChevronRight, Activity } from 'lucide-react';
import heroImg from '../assets/hero.jpg';

export default function Home({ onLoginClick, currentUser }) {
  const navigate = useNavigate();
  const observerRef = useRef(null);
  const [homeTopic, setHomeTopic] = useState('');

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('animate-fade-in'); observerRef.current.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.scroll-reveal').forEach(el => observerRef.current.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  const handleStartExploring = () => {
    if (currentUser) {
      navigate('/research', { state: { initialTopic: homeTopic } });
    } else {
      sessionStorage.setItem('pending_research_topic', homeTopic);
      onLoginClick(false);
    }
  };

  const features = [
    { icon: <Network size={24} />, title: 'Swarm Intelligence', desc: 'Agents collaborate and share insights in real-time, solving problems faster than any single model.' },
    { icon: <Database size={24} />, title: 'Deep Data Mining', desc: 'Autonomous crawlers extract, structure, and synthesize data from millions of unstructured sources.' },
    { icon: <Zap size={24} />, title: 'Real-time Execution', desc: 'Execute complex multi-step pipelines with sub-second latency across our distributed network.' },
    { icon: <Lock size={24} />, title: 'Enterprise Security', desc: 'Bank-grade encryption and isolated environments ensure your research data stays confidential.' },
    { icon: <Activity size={24} />, title: 'Predictive Analytics', desc: 'Forecast trends and identify anomalies with highly specialized predictive modeling agents.' },
    { icon: <BarChart size={24} />, title: 'Interactive Reporting', desc: 'Generate beautiful, comprehensive reports dynamically as research progresses.' },
  ];

  const stats = [
    { value: '10M+', label: 'Sources Indexed' },
    { value: '99.9%', label: 'Uptime SLA' },
    { value: '< 2s', label: 'Avg Response Time' },
    { value: '150+', label: 'Enterprise Clients' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg-glow"></div>
        <div className="container hero-content">
          <div className="hero-text animate-fade-in">
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: '2rem', padding: '0.4rem 1rem', marginBottom: '1.5rem',
              fontSize: '0.85rem', color: 'var(--accent-primary)',
            }}>
              <Zap size={14} /> Now powered by Llama 3.1 70B
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', lineHeight: 1.1 }}>
              Unleash the Power of <br />
              <span className="text-gradient">Multi-Agent</span> Research
            </h1>
            <p className="hero-subtitle" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }}>
              Automate complex research workflows, synthesize vast data, and generate actionable insights with our state-of-the-art autonomous AI agent network.
            </p>
            <div className="hero-actions" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
              <button className="btn btn-primary" onClick={handleStartExploring} style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
                Start Exploring <ArrowRight size={18} />
              </button>
              <Link to="/how-it-works" className="btn btn-outline" style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
                How It Works
              </Link>
            </div>
          </div>
          <div className="hero-visual animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="hero-image-wrapper animate-float">
              <img src={heroImg} alt="Multi Agent AI Network" className="hero-image" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', padding: '2rem 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '2rem', textAlign: 'center' }}>
          {stats.map((stat, i) => (
            <div key={i} className="scroll-reveal">
              <div className="text-gradient" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800 }}>{stat.value}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section id="features" className="features">
        <div className="container">
          <div className="section-header scroll-reveal">
            <h2>Unprecedented <span className="text-gradient">Capabilities</span></h2>
            <p>Our multi-agent system divides complex problems into specialized sub-tasks, solved concurrently by expert AI agents.</p>
          </div>
          <div className="grid features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card glass-panel scroll-reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/features" className="btn btn-outline">View All Features <ChevronRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '6rem 0', background: 'var(--bg-secondary)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="glass-panel scroll-reveal" style={{ padding: 'clamp(2rem, 5vw, 4rem)', maxWidth: '800px', margin: '0 auto', background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.1))' }}>
            <Brain size={56} color="var(--accent-primary)" style={{ margin: '0 auto 1.5rem', display: 'block' }} />
            <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', marginBottom: '1rem' }}>
              Ready to Transform Your Research?
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)' }}>
              Join thousands of researchers and enterprises using NexusAI to gain an unfair competitive advantage.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={handleStartExploring}>
                Start Free Today <ArrowRight size={18} />
              </button>
              <Link to="/contact" className="btn btn-outline">Talk to Sales</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
