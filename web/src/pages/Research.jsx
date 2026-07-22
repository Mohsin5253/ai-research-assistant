import { useState, useRef, useEffect } from 'react';
import { Brain, Loader2, ArrowRight, Search, FileText, Sparkles, Download, Menu, X, MessageSquare, History } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useNavigate, useLocation } from 'react-router-dom';
import html2pdf from 'html2pdf.js';

export default function Research({ currentUser, token, onLoginClick }) {
  const location = useLocation();
  const [topic, setTopic] = useState(() => location.state?.initialTopic || sessionStorage.getItem('pending_research_topic') || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); 
  const [error, setError] = useState(null);
  const [phase, setPhase] = useState('');
  const [hasAutoStarted, setHasAutoStarted] = useState(() => !(location.state?.initialTopic || sessionStorage.getItem('pending_research_topic')));
  
  const [sessions, setSessions] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [followUp, setFollowUp] = useState('');
  
  const resultsRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.removeItem('pending_research_topic');
    if (token) fetchSessions();
  }, [token]);

  useEffect(() => {
    if (!currentUser) onLoginClick(true);
  }, [currentUser]);

  const fetchSessions = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const res = await fetch(`${API_URL}/api/sessions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
      }
    } catch (e) {
      console.error('Failed to fetch sessions', e);
    }
  };

  const loadSession = async (sessionId) => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);
      setSidebarOpen(false); 
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const res = await fetch(`${API_URL}/api/sessions/${sessionId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTopic(data.topic);
        const lastReport = data.messages.slice().reverse().find(m => m.message_type === 'report')?.content || '';
        const lastCritic = data.messages.slice().reverse().find(m => m.message_type === 'critic')?.content || '';
        setResult({
          session_id: data.id,
          topic: data.topic,
          report: lastReport,
          feedback: lastCritic
        });
        setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      }
    } catch (e) {
      setError('Failed to load session');
    } finally {
      setLoading(false);
    }
  };

  const phases = [
    { text: '🔍 Analyzing topic and initiating multi-query search...', short: 'Analyzing...' },
    { text: '📄 Gathering broad context from multiple web sources...', short: 'Gathering...' },
    { text: '🕷️ Deep scraping and extracting knowledge from top URLs...', short: 'Scraping...' },
    { text: '🧠 Synthesizing massive data sets...', short: 'Synthesizing...' },
    { text: '✍️ Drafting extensive 2000+ word analysis (this takes a moment)...', short: 'Drafting...' },
    { text: '🧐 Critic reviewing and refining final gaps...', short: 'Reviewing...' },
    { text: '✅ Finalizing elite research...', short: 'Finalizing...' }
  ];

  const handleResearch = async (isFollowUp = false) => {
    const activePrompt = isFollowUp ? followUp : topic;
    if (!activePrompt.trim()) return;
    if (!token) { onLoginClick(); return; }

    setLoading(true);
    setError(null);
    if (!isFollowUp) setResult(null);

    let phaseIdx = 0;
    setPhase(phases[0]);
    const phaseInterval = setInterval(() => {
      phaseIdx = Math.min(phaseIdx + 1, phases.length - 1);
      setPhase(phases[phaseIdx]);
    }, 25000);

    try {
      const bodyPayload = isFollowUp 
        ? { session_id: result.session_id, prompt: followUp }
        : { topic };

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/api/research`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(bodyPayload),
      });

      clearInterval(phaseInterval);
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data = await response.json();
      setResult(data);
      if (isFollowUp) setFollowUp('');
      fetchSessions(); 
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setPhase('');
      clearInterval(phaseInterval);
    }
  };

  const downloadPdf = () => {
    const originalElement = document.getElementById('report-content');
    
    // Create a clone to prevent flashing the UI and to ensure perfect PDF formatting
    const element = originalElement.cloneNode(true);
    element.style.width = '800px';
    element.style.maxWidth = 'none';
    element.style.padding = '40px';
    element.style.background = '#ffffff';
    element.style.color = '#000000';
    
    // Force all text elements inside the clone to be black and properly wrapped
    const allElements = element.querySelectorAll('*');
    allElements.forEach(el => {
      el.style.color = '#000000';
      el.style.backgroundColor = 'transparent';
      el.style.wordWrap = 'break-word';
      el.style.whiteSpace = 'pre-wrap';
    });
    
    // Temporarily append to body so html2canvas can render it
    element.style.position = 'absolute';
    element.style.left = '-9999px';
    document.body.appendChild(element);
    
    const opt = {
      margin:       0.5,
      filename:     `Research_Report_${topic.replace(/\s+/g, '_')}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, windowWidth: 800 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' },
      pagebreak:    { mode: ['css', 'legacy'], avoid: ['p', 'h1', 'h2', 'h3', 'h4', 'li'] }
    };
    
    html2pdf().set(opt).from(element).save().then(() => {
      document.body.removeChild(element);
    });
  };

  const downloadDocx = () => {
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Research Report</title></head><body style='font-family: Arial, sans-serif; color: black; background: white;'>";
    const footer = "</body></html>";
    const element = document.getElementById('report-content');
    const html = header + element.innerHTML + footer;
    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Research_Report_${topic.replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (topic && token && !hasAutoStarted && !loading && !result && !error) {
      setHasAutoStarted(true);
      handleResearch(false);
    }
  }, [topic, token, hasAutoStarted, loading, result, error]);

  const MarkdownComponents = {
    a: ({node, ...props}) => {
      let href = props.href || '';
      if (href && !/^https?:\/\//i.test(href)) {
        href = `https://${href}`;
      }
      return <a {...props} href={href} target="_blank" rel="noopener noreferrer" style={{color: 'var(--accent-primary)', textDecoration: 'underline'}} />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', paddingTop: '64px' }}>
      
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }} onClick={() => setSidebarOpen(false)} />
      )}

      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'space-between' : 'center', marginBottom: '1rem', width: '100%', padding: sidebarOpen ? '0' : '0' }}>
          {sidebarOpen && (
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', margin: 0, whiteSpace: 'nowrap' }}>
              <History size={18} /> History
            </h3>
          )}
          <button className="btn" onClick={() => setSidebarOpen(!sidebarOpen)} style={{ padding: '0.25rem', background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <Menu size={24} color="var(--text-secondary)" />
          </button>
        </div>
        
        {sidebarOpen && (
          <>
            <button className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem', whiteSpace: 'nowrap' }} onClick={() => { setResult(null); setTopic(''); setFollowUp(''); if(window.innerWidth < 768) setSidebarOpen(false); }}>
              + New Research
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {sessions.length === 0 ? (
                <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', textAlign: 'center' }}>No previous research</p>
              ) : (
                sessions.map(s => (
                  <div key={s.id} onClick={() => loadSession(s.id)} style={{
                    padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--bg-glass)',
                    cursor: 'pointer', border: '1px solid transparent', transition: 'all 0.2s',
                    overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'
                  }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-primary)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{s.topic}</span>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{new Date(s.created_at).toLocaleDateString()}</div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      <div className="main-content">
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>

          {!result && !loading && (
            <div style={{ textAlign: 'center', marginBottom: '3rem' }} className="animate-fade-in">
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <Brain size={36} color="white" />
              </div>
              <h1 style={{ fontSize: 'clamp(1.75rem, 5vw, 3rem)', marginBottom: '0.75rem' }}>
                <span className="text-gradient">Deep</span> Research
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)' }}>
                Enter a topic and our AI will synthesize an exhaustive, multi-section report.
              </p>
            </div>
          )}

          {!result && (
            <div className="glass-panel animate-fade-in" style={{ padding: 'clamp(1.5rem, 4vw, 2.5rem)', borderRadius: '1.5rem', marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>Research Topic</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <textarea
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleResearch(false); } }}
                  placeholder="e.g. The impact of AGI on global economics by 2035..."
                  disabled={loading} rows={3}
                  style={{ width: '100%', minHeight: '120px', resize: 'vertical', padding: '0.875rem 1.25rem', borderRadius: '0.875rem', border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '1rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn btn-primary" onClick={() => handleResearch(false)} disabled={loading || !topic.trim()} style={{ padding: '0.875rem 1.5rem', whiteSpace: 'nowrap' }}>
                    {loading ? <><Loader2 size={18} className="animate-spin" /> {phase?.short || 'Working...'}</> : <>Research <ArrowRight size={18} /></>}
                  </button>
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="glass-panel animate-fade-in" style={{ padding: '2rem', textAlign: 'center', borderRadius: '1rem', marginBottom: '2rem', marginTop: result ? '2rem' : '0' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-primary)', animation: `pulse 1.2s ease-in-out ${i * 0.3}s infinite` }} />
                ))}
              </div>
              <p style={{ color: 'var(--accent-primary)', fontWeight: 600, marginBottom: '0.5rem' }}>{phase?.text}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Your AI agents are collaborating on a deep dive. This may take 1-3 minutes.</p>
            </div>
          )}

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '1rem', padding: '1.5rem', marginBottom: '2rem', color: '#f87171' }}>⚠️ {error}</div>
          )}

          {result && (
            <div ref={resultsRef} className="animate-fade-in">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Sparkles size={20} color="var(--accent-primary)" />
                  <h2 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', margin: 0 }}>Research Results: <span className="text-gradient">{result.topic}</span></h2>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button onClick={downloadPdf} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Download size={16} /> PDF</button>
                  <button onClick={downloadDocx} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Download size={16} /> DOCX</button>
                </div>
              </div>

              <div id="report-content" className="glass-panel" style={{ padding: 'clamp(1.25rem, 4vw, 2rem)', borderRadius: '1rem', marginBottom: '1.5rem', background: 'var(--bg-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
                  <FileText size={20} color="var(--accent-primary)" />
                  <h3 style={{ color: 'var(--accent-primary)', margin: 0 }}>Deep Research Report</h3>
                </div>
                <div className="markdown-content" style={{ color: 'var(--text-primary)', lineHeight: 1.8 }}>
                  <ReactMarkdown components={MarkdownComponents}>{result.report}</ReactMarkdown>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: 'clamp(1.25rem, 4vw, 2rem)', borderRadius: '1rem', border: '1px solid rgba(168,85,247,0.3)', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
                  <Brain size={20} color="var(--accent-secondary)" />
                  <h3 style={{ color: 'var(--accent-secondary)', margin: 0 }}>Critic Review</h3>
                </div>
                <div className="markdown-content" style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                  <ReactMarkdown components={MarkdownComponents}>{result.feedback}</ReactMarkdown>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  <MessageSquare size={18} color="var(--accent-primary)" /> Follow-up or Refine Report
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <textarea
                    value={followUp}
                    onChange={e => setFollowUp(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleResearch(true); } }}
                    placeholder="e.g. Make the conclusion shorter, or add a section about economic impact..."
                    disabled={loading} rows={2}
                    style={{ width: '100%', minHeight: '80px', resize: 'vertical', padding: '0.875rem 1.25rem', borderRadius: '0.875rem', border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '1rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button className="btn btn-outline" onClick={() => { setResult(null); setTopic(''); setFollowUp(''); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                      Start New Research
                    </button>
                    <button className="btn btn-primary" onClick={() => handleResearch(true)} disabled={loading || !followUp.trim()} style={{ padding: '0.875rem 1.5rem', whiteSpace: 'nowrap' }}>
                      {loading ? <><Loader2 size={18} className="animate-spin" /> {phase?.short || 'Updating...'}</> : <>Update Report <ArrowRight size={18} /></>}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
