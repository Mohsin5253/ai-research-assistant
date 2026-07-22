import { useEffect, useState } from 'react';
import { Brain, Zap, Globe, Shield, ExternalLink } from 'lucide-react';

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('animate-fade-in'); observer.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const posts = [
    {
      title: 'The Rise of Multi-Agent AI Systems',
      excerpt: 'How companies are building AI agent teams that collaborate, debate, and outperform single models on complex reasoning tasks.',
      category: 'Research', readTime: '8 min read', date: 'Jul 15, 2025',
      icon: <Brain size={24} />, color: '#6366f1', featured: true,
      url: 'https://arxiv.org/abs/2402.01680',
    },
    {
      title: 'Groq LPU: The Fastest LLM Inference Engine',
      excerpt: 'Groq\'s Language Processing Unit delivers 10x faster inference than traditional GPUs. Here\'s how it changes the game for real-time AI applications.',
      category: 'Engineering', readTime: '12 min read', date: 'Jul 10, 2025',
      icon: <Zap size={24} />, color: '#f59e0b',
      url: 'https://groq.com/technology/',
    },
    {
      title: 'How AI is Transforming Climate Research',
      excerpt: 'Researchers are using multi-agent AI to process thousands of climate papers, surfacing critical trends and accelerating policy decisions.',
      category: 'Case Study', readTime: '6 min read', date: 'Jul 5, 2025',
      icon: <Globe size={24} />, color: '#10b981',
      url: 'https://www.nature.com/articles/d41586-024-00780-8',
    },
    {
      title: 'Building Secure APIs with FastAPI & JWT',
      excerpt: 'A deep dive into production authentication with FastAPI — covering bcrypt hashing, OAuth2 flows, and JWT token best practices.',
      category: 'Engineering', readTime: '15 min read', date: 'Jun 28, 2025',
      icon: <Shield size={24} />, color: '#8b5cf6',
      url: 'https://fastapi.tiangolo.com/tutorial/security/',
    },
    {
      title: 'LangChain vs LangGraph: Agent Orchestration Compared',
      excerpt: 'An honest comparison of both frameworks for building stateful multi-step agent systems with real code examples and performance benchmarks.',
      category: 'Technical', readTime: '10 min read', date: 'Jun 20, 2025',
      icon: <Brain size={24} />, color: '#06b6d4',
      url: 'https://blog.langchain.dev/langgraph/',
    },
    {
      title: 'Reducing LLM Hallucinations with Critic Agents',
      excerpt: 'How layered review agents can catch and correct factual errors in AI-generated content, reducing hallucination rates by over 60%.',
      category: 'Research', readTime: '9 min read', date: 'Jun 14, 2025',
      icon: <Zap size={24} />, color: '#ec4899',
      url: 'https://arxiv.org/abs/2310.01798',
    },
    {
      title: 'Tavily: The Search API Built for AI Agents',
      excerpt: 'Why Tavily is becoming the go-to search engine for LLM-powered applications and how it compares to Google Custom Search and Bing API.',
      category: 'Technical', readTime: '7 min read', date: 'Jun 8, 2025',
      icon: <Globe size={24} />, color: '#14b8a6',
      url: 'https://tavily.com/',
    },
    {
      title: 'Meta Llama 3: The Open-Source LLM Revolution',
      excerpt: 'Meta\'s Llama 3 models are pushing the boundaries of open-source AI. We explore the architecture, benchmarks, and real-world performance.',
      category: 'Research', readTime: '11 min read', date: 'May 30, 2025',
      icon: <Brain size={24} />, color: '#f97316',
      url: 'https://ai.meta.com/blog/meta-llama-3/',
    },
    {
      title: 'How a Law Firm Used AI Agents for Due Diligence',
      excerpt: 'A case study on how multi-agent research automated contract analysis and risk assessment, saving 200+ hours of manual legal review.',
      category: 'Case Study', readTime: '8 min read', date: 'May 22, 2025',
      icon: <Shield size={24} />, color: '#a855f7',
      url: 'https://hbr.org/2023/04/generative-ai-can-help-you-tailor-your-sales-approach',
    },
  ];

  const categories = ['All', 'Research', 'Engineering', 'Case Study', 'Technical'];

  const filteredPosts = activeCategory === 'All'
    ? posts
    : posts.filter(p => p.category === activeCategory);

  const featuredPost = filteredPosts.find(p => p.featured);
  const regularPosts = filteredPosts.filter(p => !p.featured);

  return (
    <div style={{ paddingTop: '80px' }}>
      {/* Hero */}
      <section style={{ padding: 'clamp(4rem, 10vw, 7rem) 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="hero-bg-glow" style={{ opacity: 0.4 }} />
        <div className="container animate-fade-in" style={{ position: 'relative', zIndex: 1 }}>
          <span style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Our Blog</span>
          <h1 style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', margin: '1rem 0' }}>
            Insights from the <span className="text-gradient">Frontier</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto', fontSize: 'clamp(1rem, 2.5vw, 1.15rem)' }}>
            Deep dives into AI research, engineering decisions, and case studies from the NexusAI team.
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section style={{ padding: 'clamp(2rem, 6vw, 5rem) 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          {/* Category Filter */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '3rem', justifyContent: 'center' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '0.5rem 1.25rem', borderRadius: '2rem',
                  border: `1px solid ${activeCategory === cat ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                  background: activeCategory === cat ? 'rgba(99,102,241,0.15)' : 'transparent',
                  color: activeCategory === cat ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer', fontSize: '0.875rem', transition: 'all 0.2s',
                  fontWeight: activeCategory === cat ? 600 : 400,
                }}
                onMouseEnter={e => { if (activeCategory !== cat) { e.target.style.borderColor = 'var(--accent-primary)'; e.target.style.color = 'var(--text-primary)'; } }}
                onMouseLeave={e => { if (activeCategory !== cat) { e.target.style.borderColor = 'var(--border-subtle)'; e.target.style.color = 'var(--text-secondary)'; } }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Featured Post */}
          {featuredPost && (
            <a href={featuredPost.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <div className="glass-panel scroll-reveal" style={{
                padding: 'clamp(1.5rem, 4vw, 2.5rem)', marginBottom: '2rem', borderRadius: '1.5rem',
                border: '1px solid rgba(99,102,241,0.3)',
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', alignItems: 'center',
                cursor: 'pointer', transition: 'transform 0.2s, border-color 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = featuredPost.color; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; }}
              >
                <div>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ background: 'rgba(99,102,241,0.15)', color: '#6366f1', padding: '0.3rem 0.8rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 600 }}>FEATURED</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{featuredPost.category} · {featuredPost.readTime} · {featuredPost.date}</span>
                  </div>
                  <h2 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', marginBottom: '1rem', lineHeight: 1.3 }}>{featuredPost.title}</h2>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>{featuredPost.excerpt}</p>
                  <span className="btn btn-primary" style={{ fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    Read Article <ExternalLink size={14} />
                  </span>
                </div>
                <div style={{
                  height: '200px', borderRadius: '1rem',
                  background: `linear-gradient(135deg, ${featuredPost.color}22, ${featuredPost.color}44)`,
                  border: `1px solid ${featuredPost.color}33`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{ color: featuredPost.color, opacity: 0.8 }}><Brain size={80} /></div>
                </div>
              </div>
            </a>
          )}

          {/* Regular Posts Grid */}
          {regularPosts.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {regularPosts.map((post, i) => (
                <a
                  key={i}
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="glass-panel scroll-reveal" style={{ padding: '1.75rem', borderRadius: '1rem', cursor: 'pointer', transition: 'transform 0.2s, border-color 0.2s', border: '1px solid var(--border-subtle)', height: '100%' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = post.color; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
                  >
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '0.75rem',
                      background: `${post.color}22`, border: `1px solid ${post.color}33`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: post.color, marginBottom: '1.25rem',
                    }}>{post.icon}</div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{ background: `${post.color}22`, color: post.color, padding: '0.2rem 0.6rem', borderRadius: '2rem', fontSize: '0.7rem', fontWeight: 600 }}>{post.category}</span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{post.readTime} · {post.date}</span>
                    </div>
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', lineHeight: 1.4 }}>{post.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1rem' }}>{post.excerpt}</p>
                    <span style={{ color: post.color, fontSize: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      Read more <ExternalLink size={13} />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-secondary)' }}>
              <p style={{ fontSize: '1.1rem' }}>No articles found in the "{activeCategory}" category.</p>
              <button
                onClick={() => setActiveCategory('All')}
                className="btn btn-outline"
                style={{ marginTop: '1rem' }}
              >
                View All Articles
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
