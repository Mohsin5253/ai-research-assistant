import { Code, Terminal, Key } from 'lucide-react';

export default function ApiDocs() {
  return (
    <div style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '4rem' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }} className="animate-fade-in">
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}>
            <Terminal size={36} color="white" />
          </div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', marginBottom: '0.75rem' }}>
            <span className="text-gradient">API Documentation</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Integrate NexusAI Research Systems directly into your own applications.
          </p>
        </div>

        <div className="glass-panel animate-fade-in" style={{ padding: 'clamp(1.5rem, 4vw, 3rem)', borderRadius: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Key size={24} color="var(--accent-primary)" />
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Authentication</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            All API endpoints (except login/registration) require a Bearer token in the Authorization header.
          </p>
          
          <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>POST /api/auth/token</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>Exchange user credentials for an access token.</p>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border-subtle)', fontFamily: 'monospace', fontSize: '0.9rem', color: '#a78bfa', marginBottom: '2rem', overflowX: 'auto' }}>
            curl -X POST http://localhost:8000/api/auth/token \<br/>
            &nbsp;&nbsp;-d "username=user@example.com&password=yourpassword"
          </div>
        </div>

        <div className="glass-panel animate-fade-in" style={{ padding: 'clamp(1.5rem, 4vw, 3rem)', borderRadius: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Code size={24} color="var(--accent-secondary)" />
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Core Research API</h2>
          </div>

          <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>POST /api/research</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Trigger a deep multi-agent research task or follow up on an existing session.
          </p>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Request Body (New Research):</strong>
            <pre style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border-subtle)', color: '#f87171', marginTop: '0.5rem', overflowX: 'auto' }}>
{`{
  "topic": "The future of Quantum Computing"
}`}
            </pre>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Request Body (Follow-up):</strong>
            <pre style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border-subtle)', color: '#60a5fa', marginTop: '0.5rem', overflowX: 'auto' }}>
{`{
  "session_id": 12,
  "prompt": "Make the conclusion more concise."
}`}
            </pre>
          </div>

          <div>
            <strong style={{ color: 'var(--text-primary)' }}>Response:</strong>
            <pre style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border-subtle)', color: '#34d399', marginTop: '0.5rem', overflowX: 'auto' }}>
{`{
  "success": true,
  "session_id": 12,
  "topic": "The future of Quantum Computing",
  "report": "# Executive Summary\\n...",
  "feedback": "The report effectively covers..."
}`}
            </pre>
          </div>
        </div>

        <div className="glass-panel animate-fade-in" style={{ padding: 'clamp(1.5rem, 4vw, 3rem)', borderRadius: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Terminal size={24} color="var(--text-primary)" />
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>History API</h2>
          </div>

          <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>GET /api/sessions</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Retrieve all historical research sessions for the authenticated user.
          </p>

          <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', marginTop: '2rem' }}>GET /api/sessions/:id</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Retrieve a specific session along with its entire message history and reports.
          </p>
        </div>
        
      </div>
    </div>
  );
}
