import { useEffect } from 'react';
import { Briefcase, MapPin, Clock, ArrowRight, Zap } from 'lucide-react';

export default function Careers() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('animate-fade-in'); observer.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const perks = [
    { emoji: '🌍', title: 'Remote First', desc: 'Work from anywhere in the world. We have team members in 12 countries.' },
    { emoji: '💰', title: 'Competitive Pay', desc: 'Top-of-market salary plus equity. We believe in sharing success.' },
    { emoji: '🧠', title: 'Learn & Grow', desc: '$5,000/year learning budget for courses, books, and conferences.' },
    { emoji: '🏖️', title: 'Unlimited PTO', desc: 'We trust you to manage your time. Rest is part of the job.' },
    { emoji: '🚀', title: 'Cutting-Edge Tech', desc: 'Work with the latest LLMs, agent frameworks, and GPU hardware.' },
    { emoji: '👥', title: 'Elite Team', desc: 'Collaborate with researchers, engineers, and builders from world-class backgrounds.' },
  ];

  const openRoles = [
    { title: 'Senior AI Research Engineer', dept: 'Engineering', location: 'Remote (Global)', type: 'Full-time', color: '#6366f1' },
    { title: 'LangChain / LangGraph Specialist', dept: 'Engineering', location: 'Remote (US/EU)', type: 'Full-time', color: '#8b5cf6' },
    { title: 'Backend Engineer (FastAPI)', dept: 'Engineering', location: 'Remote (Global)', type: 'Full-time', color: '#06b6d4' },
    { title: 'Product Manager — AI Platform', dept: 'Product', location: 'Remote (US preferred)', type: 'Full-time', color: '#10b981' },
    { title: 'Technical Content Writer', dept: 'Marketing', location: 'Remote (Global)', type: 'Part-time / Contract', color: '#f59e0b' },
    { title: 'ML Ops Engineer', dept: 'Infrastructure', location: 'Remote (Global)', type: 'Full-time', color: '#ec4899' },
  ];

  return (
    <div style={{ paddingTop: '80px' }}>
      {/* Hero */}
      <section style={{ padding: 'clamp(4rem, 10vw, 7rem) 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="hero-bg-glow" style={{ opacity: 0.5 }} />
        <div className="container animate-fade-in" style={{ position: 'relative', zIndex: 1 }}>
          <span style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Join Our Team</span>
          <h1 style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', margin: '1rem 0' }}>
            Build the Future of <span className="text-gradient">Intelligence</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: 'clamp(1rem, 2.5vw, 1.2rem)' }}>
            We're a small, ambitious team solving one of the most important problems in AI. If you want your work to matter, you're in the right place.
          </p>
          <div style={{ marginTop: '2rem' }}>
            <a href="#openings" className="btn btn-primary">View Open Roles <ArrowRight size={18} /></a>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section style={{ padding: 'clamp(3rem, 8vw, 6rem) 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header scroll-reveal">
            <h2>Why Work at <span className="text-gradient">NexusAI</span>?</h2>
            <p>We're building something important — and we make sure the people doing it are thriving.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {perks.map((perk, i) => (
              <div key={i} className="glass-panel scroll-reveal" style={{ padding: '1.75rem', transitionDelay: `${i * 0.1}s` }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{perk.emoji}</div>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>{perk.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>{perk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section id="openings" style={{ padding: 'clamp(3rem, 8vw, 6rem) 0' }}>
        <div className="container">
          <div className="section-header scroll-reveal">
            <h2>Open <span className="text-gradient">Positions</span></h2>
            <p>{openRoles.length} roles currently available</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '800px', margin: '0 auto' }}>
            {openRoles.map((role, i) => (
              <div key={i} className="glass-panel scroll-reveal"
                style={{
                  padding: 'clamp(1.25rem, 3vw, 1.75rem)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  gap: '1rem', flexWrap: 'wrap', cursor: 'pointer',
                  borderLeft: `4px solid ${role.color}`,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateX(4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}
              >
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <h3 style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', marginBottom: '0.4rem' }}>{role.title}</h3>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      <Briefcase size={14} /> {role.dept}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      <MapPin size={14} /> {role.location}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      <Clock size={14} /> {role.type}
                    </span>
                  </div>
                </div>
                <button className="btn btn-outline" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                  Apply Now →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
