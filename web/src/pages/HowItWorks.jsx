import { useEffect } from 'react';
import { Search, Globe, PenLine, ShieldCheck, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import analysisImg from '../assets/analysis.jpg';
import synthesisImg from '../assets/synthesis.jpg';
import writerImg from '../assets/writer.jpg';
import criticImg from '../assets/critic.jpg';
import topicImg from '../assets/topic_input.jpg';

export default function HowItWorks() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('animate-fade-in'); observer.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      num: '01', icon: <Search size={32} />, title: 'You Provide a Topic',
      desc: 'Enter any research topic — from highly technical scientific domains to business strategy questions. Our system handles the rest autonomously.',
      points: ['Natural language input', 'Supports any domain', 'No prompt engineering needed'],
      color: '#6366f1',
      img: topicImg,
    },
    {
      num: '02', icon: <Globe size={32} />, title: 'Search Agent Gathers Data',
      desc: 'A dedicated Search Agent uses Tavily to perform targeted web searches, identifying the most authoritative and relevant sources for your topic.',
      points: ['Real-time web access', 'Source credibility scoring', 'Multi-query strategy'],
      color: '#8b5cf6',
      img: analysisImg,
    },
    {
      num: '03', icon: <PenLine size={32} />, title: 'Reader Agent Extracts Insights',
      desc: 'A specialized Reader Agent scrapes and parses each source, extracting key facts, statistics, and arguments into structured knowledge.',
      points: ['Full content parsing', 'Quote extraction', 'Fact tagging'],
      color: '#06b6d4',
      img: synthesisImg,
    },
    {
      num: '04', icon: <PenLine size={32} />, title: 'Writer Agent Synthesizes Report',
      desc: 'Our Writer Agent, powered by Llama 3.1 70B on Groq, weaves together all gathered knowledge into a structured, professional research report.',
      points: ['Introduction, findings, conclusion', 'Cited sources', 'Structured markdown output'],
      color: '#10b981',
      img: writerImg,
    },
    {
      num: '05', icon: <ShieldCheck size={32} />, title: 'Critic Agent Reviews Quality',
      desc: 'Before delivery, a Critic Agent independently reviews the report, scoring it on accuracy, completeness, and bias — ensuring only high-quality output reaches you.',
      points: ['Accuracy scoring', 'Gap identification', 'Improvement suggestions'],
      color: '#f59e0b',
      img: criticImg,
    },
  ];

  const faqs = [
    { q: 'How long does a research query take?', a: 'Typically 30–90 seconds depending on the complexity of the topic and the number of sources our agents decide to process.' },
    { q: 'What LLM is powering the agents?', a: 'We use Meta\'s Llama 3.1 70B model running on Groq\'s ultra-fast LPU inference hardware.' },
    { q: 'How is my data secured?', a: 'All requests are authenticated with JWT tokens. Passwords are hashed with bcrypt. We never store your research results on our servers.' },
    { q: 'Can I use my own API keys?', a: 'Yes! You can configure GROQ_API_KEY and TAVILY_API_KEY in the .env file to use your own accounts and quotas.' },
  ];

  return (
    <div style={{ paddingTop: '80px' }}>
      {/* Hero */}
      <section style={{ padding: 'clamp(4rem, 10vw, 7rem) 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="hero-bg-glow" style={{ opacity: 0.4 }} />
        <div className="container animate-fade-in" style={{ position: 'relative', zIndex: 1 }}>
          <span style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>The Process</span>
          <h1 style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', margin: '1rem 0' }}>
            How the <span className="text-gradient">Nexus</span> Operates
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: 'clamp(1rem, 2.5vw, 1.2rem)' }}>
            A seamless, 5-stage autonomous pipeline from your question to a comprehensive, verified research report.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section style={{ padding: 'clamp(2rem, 6vw, 5rem) 0', background: 'var(--bg-secondary)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          {steps.map((step, i) => (
            <div key={i} className="scroll-reveal" style={{
              display: 'grid',
              gridTemplateColumns: step.img ? '1fr 1fr' : '1fr',
              gap: '2.5rem',
              alignItems: 'center',
              marginBottom: 'clamp(3rem, 8vw, 5rem)',
              flexDirection: i % 2 === 1 ? 'row-reverse' : 'row',
            }}>
              <div style={{ order: step.img && i % 2 === 1 ? 2 : 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{
                    width: '56px', height: '56px', borderRadius: '1rem',
                    background: `${step.color}22`, border: `1px solid ${step.color}44`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: step.color, flexShrink: 0,
                  }}>{step.icon}</div>
                  <span style={{ fontSize: '3.5rem', fontWeight: 900, color: step.color, opacity: 0.85, lineHeight: 1, letterSpacing: '-0.02em' }}>{step.num}</span>
                </div>
                <h2 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', marginBottom: '0.875rem' }}>{step.title}</h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>{step.desc}</p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {step.points.map((p, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      <ChevronRight size={16} color={step.color} />{p}
                    </li>
                  ))}
                </ul>
              </div>
              {step.img && (
                <div className="glass-panel" style={{ borderRadius: '1rem', overflow: 'hidden', order: i % 2 === 1 ? 0 : 2 }}>
                  <img src={step.img} alt={step.title} style={{ width: '100%', height: '250px', objectFit: 'cover', display: 'block' }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: 'clamp(3rem, 8vw, 6rem) 0' }}>
        <div className="container" style={{ maxWidth: '750px' }}>
          <div className="section-header scroll-reveal">
            <h2>Frequently Asked <span className="text-gradient">Questions</span></h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((faq, i) => (
              <div key={i} className="glass-panel scroll-reveal" style={{ padding: '1.5rem 2rem' }}>
                <h4 style={{ marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>Q: {faq.q}</h4>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/research" className="btn btn-primary">Try It Now <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
