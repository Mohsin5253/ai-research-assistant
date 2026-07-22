import { useEffect } from 'react';
import { Network, Database, Zap, Lock, BarChart, Activity, Brain, Search, FileText, Shield, Cpu, Globe } from 'lucide-react';

export default function Features() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('animate-fade-in'); observer.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const mainFeatures = [
    { icon: <Network size={32} />, title: 'Swarm Intelligence', desc: 'Multiple specialized agents collaborate simultaneously, each bringing deep expertise to different aspects of your research question. Unlike single-model approaches, our swarm eliminates bias and covers blind spots.', badge: 'Core' },
    { icon: <Database size={32} />, title: 'Deep Data Mining', desc: 'Our reader agents autonomously crawl, parse, and understand complex data from academic papers, news, APIs, and private databases. Structured or unstructured — our agents handle it all.', badge: 'Core' },
    { icon: <Brain size={32} />, title: 'LLM-Powered Synthesis', desc: 'Powered by Llama 3.1 70B via Groq, our writer agent synthesizes disparate information into cohesive, structured reports with citations, key findings, and actionable recommendations.', badge: 'AI' },
    { icon: <Search size={32} />, title: 'Real-time Web Search', desc: 'Integrated with Tavily Search API to give your agents access to real-time information from across the internet, ensuring your reports are always based on current data.', badge: 'Search' },
    { icon: <FileText size={32} />, title: 'Critic & Quality Control', desc: 'Every report is automatically reviewed by a dedicated critic agent that scores accuracy, identifies gaps, and suggests improvements — maintaining quality you can trust.', badge: 'Quality' },
    { icon: <Lock size={32} />, title: 'JWT Authentication', desc: 'Bank-grade security with bcrypt password hashing and JWT tokens. Your research and account data are fully protected with industry-standard authentication protocols.', badge: 'Security' },
    { icon: <Zap size={32} />, title: 'Groq Inference Speed', desc: 'By running on Groq hardware, our LLM inference is 10x faster than standard GPU servers — meaning you get comprehensive research reports in seconds, not minutes.', badge: 'Speed' },
    { icon: <Globe size={32} />, title: 'Multi-Source Validation', desc: 'Agents cross-reference claims across multiple independent sources, dramatically reducing hallucinations and ensuring factual accuracy in every report generated.', badge: 'Accuracy' },
    { icon: <Cpu size={32} />, title: 'Scalable Architecture', desc: 'Built on LangChain and LangGraph, our agent pipelines are horizontally scalable. Deploy from personal projects to enterprise workloads without changing a line of code.', badge: 'Scale' },
  ];

  const badgeColors = {
    Core: '#6366f1', AI: '#8b5cf6', Search: '#06b6d4', Quality: '#10b981',
    Security: '#f59e0b', Speed: '#ef4444', Accuracy: '#3b82f6', Scale: '#ec4899',
  };

  return (
    <div style={{ paddingTop: '80px' }}>
      {/* Hero */}
      <section style={{ padding: 'clamp(4rem, 10vw, 7rem) 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="hero-bg-glow" style={{ opacity: 0.4 }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="animate-fade-in">
            <span style={{ color: 'var(--accent-primary)', fontWeight: 600, letterSpacing: '0.1em', fontSize: '0.875rem', textTransform: 'uppercase' }}>Platform Features</span>
            <h1 style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', margin: '1rem 0' }}>
              Everything You Need to <span className="text-gradient">Research Smarter</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: 'clamp(1rem, 2.5vw, 1.2rem)' }}>
              A complete, production-ready research infrastructure powered by the latest advances in multi-agent AI.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: 'clamp(2rem, 6vw, 5rem) 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {mainFeatures.map((f, i) => (
              <div key={i} className="glass-panel scroll-reveal" style={{ padding: '2rem', transitionDelay: `${(i % 3) * 0.1}s`, position: 'relative', overflow: 'hidden' }}>
                <div style={{
                  position: 'absolute', top: '1.25rem', right: '1.25rem',
                  background: `${badgeColors[f.badge]}22`,
                  color: badgeColors[f.badge],
                  border: `1px solid ${badgeColors[f.badge]}44`,
                  borderRadius: '2rem', padding: '0.2rem 0.7rem',
                  fontSize: '0.7rem', fontWeight: 600,
                }}>{f.badge}</div>
                <div style={{
                  width: '60px', height: '60px', borderRadius: '1rem',
                  background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '1.25rem', color: 'white',
                }}>{f.icon}</div>
                <h3 style={{ marginBottom: '0.75rem', fontSize: '1.1rem' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.9rem' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
