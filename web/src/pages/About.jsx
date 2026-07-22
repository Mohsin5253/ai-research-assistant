import { useEffect } from 'react';
import { Brain, Target, Users, Zap, Globe, Award, ExternalLink } from 'lucide-react';

export default function About() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('animate-fade-in'); observer.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const team = [
    { name: 'Mohsin Sidhpurwala', role: 'CEO & Co-Founder', bg: 'linear-gradient(135deg, #6366f1, #8b5cf6)', linkedin: 'https://www.linkedin.com/in/mohsin-sidhpurwala-084927375/' },
  ];

  const values = [
    { icon: <Target size={28} />, title: 'Mission-Driven', desc: 'We believe powerful research tools should be accessible to everyone, not just large enterprises.' },
    { icon: <Users size={28} />, title: 'Collaboration First', desc: 'Our multi-agent approach mirrors how the best human teams operate — diverse, specialized, and communicating.' },
    { icon: <Zap size={28} />, title: 'Relentless Innovation', desc: 'We ship fast, iterate constantly, and stay at the bleeding edge of AI and agent architectures.' },
    { icon: <Globe size={28} />, title: 'Global Impact', desc: 'From climate research to medical breakthroughs, we power research that shapes the world.' },
  ];

  return (
    <div style={{ paddingTop: '80px' }}>
      {/* Hero */}
      <section style={{ padding: 'clamp(4rem, 10vw, 8rem) 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="hero-bg-glow" style={{ opacity: 0.4 }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="animate-fade-in">
            <span style={{ color: 'var(--accent-primary)', fontWeight: 600, letterSpacing: '0.1em', fontSize: '0.875rem', textTransform: 'uppercase' }}>Our Story</span>
            <h1 style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', margin: '1rem 0', lineHeight: 1.1 }}>
              We're Building the Future of <span className="text-gradient">Research Intelligence</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto', fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', lineHeight: 1.7 }}>
              Founded in 2024, NexusAI was born from a simple belief: the world's most complex problems deserve the most advanced research tools. We combine cutting-edge LLMs with autonomous agent architectures to make that a reality.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section style={{ padding: 'clamp(3rem, 8vw, 6rem) 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {values.map((v, i) => (
              <div key={i} className="glass-panel scroll-reveal" style={{ padding: '2rem', transitionDelay: `${i * 0.1}s` }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '0.875rem',
                  background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '1.25rem', color: 'white',
                }}>{v.icon}</div>
                <h3 style={{ marginBottom: '0.75rem' }}>{v.title}</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ padding: 'clamp(3rem, 8vw, 6rem) 0' }}>
        <div className="container">
          <div className="section-header scroll-reveal">
            <h2>Meet the <span className="text-gradient">Founder</span></h2>
            <p>The visionary behind NexusAI, building the future of autonomous research intelligence.</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {team.map((member, i) => (
              <div key={i} className="glass-panel scroll-reveal" style={{ padding: '2.5rem 3.5rem', textAlign: 'center', maxWidth: '340px' }}>
                <div style={{
                  width: '100px', height: '100px', borderRadius: '50%',
                  background: member.bg, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', margin: '0 auto 1.25rem',
                  fontSize: '2.25rem', fontWeight: 700, color: 'white',
                  boxShadow: '0 0 30px rgba(99,102,241,0.3)',
                }}>
                  {member.name.charAt(0)}
                </div>
                <h3 style={{ marginBottom: '0.35rem', fontSize: '1.3rem' }}>{member.name}</h3>
                <p style={{ color: 'var(--accent-primary)', fontSize: '0.95rem', marginBottom: '1rem' }}>{member.role}</p>
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                      color: 'var(--text-secondary)', fontSize: '0.85rem',
                      textDecoration: 'none', transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#0a66c2'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                  >
                    <ExternalLink size={16} /> LinkedIn Profile
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Award banner */}
      <section style={{ padding: 'clamp(3rem, 8vw, 5rem) 0', background: 'var(--bg-secondary)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <Award size={48} color="var(--accent-primary)" style={{ margin: '0 auto 1rem', display: 'block' }} />
          <h2 className="scroll-reveal" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', marginBottom: '1rem' }}>
            Recognized by the <span className="text-gradient">Best</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>YC W25 • Forbes AI 50 • MIT Tech Review Innovators</p>
        </div>
      </section>
    </div>
  );
}
