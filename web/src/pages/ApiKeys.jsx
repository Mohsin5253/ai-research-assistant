import { useState, useEffect } from 'react';
import { Key, Plus, Trash2, Copy, Check, AlertTriangle, Code, Eye, EyeOff } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://ai-research-assistant-2zmw.onrender.com';

export default function ApiKeys({ currentUser, token, onLoginClick }) {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState(null);
  const [copied, setCopied] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser) { onLoginClick(true); return; }
    fetchKeys();
  }, [currentUser, token]);

  const fetchKeys = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/keys`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setKeys(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const createKey = async () => {
    if (!newKeyName.trim()) return;
    setCreating(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/keys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: newKeyName.trim() })
      });
      if (!res.ok) throw new Error('Failed to create key');
      const data = await res.json();
      setNewlyCreatedKey(data.full_key);
      setNewKeyName('');
      setShowCreateModal(false);
      fetchKeys();
    } catch (e) { setError(e.message); }
    finally { setCreating(false); }
  };

  const revokeKey = async (id) => {
    setDeletingId(id);
    try {
      await fetch(`${API_URL}/api/keys/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setKeys(prev => prev.filter(k => k.id !== id));
    } catch (e) { console.error(e); }
    finally { setDeletingId(null); }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const codeSnippet = `curl -X POST ${API_URL}/api/research \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -d '{"topic": "The future of quantum computing"}'`;

  return (
    <div style={{ minHeight: '100vh', paddingTop: '80px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }} className="animate-fade-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Key size={26} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.9rem', margin: 0 }}>API Keys</h1>
              <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem' }}>
                Create keys that never expire to access the research API from your own projects.
              </p>
            </div>
          </div>
        </div>

        {/* Newly Created Key Banner */}
        {newlyCreatedKey && (
          <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', borderRadius: '1rem', marginBottom: '2rem', border: '1px solid rgba(16,185,129,0.4)', background: 'rgba(16,185,129,0.07)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#34d399', fontWeight: 700 }}>
              <Check size={18} /> Key Created Successfully!
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
              ⚠️ <strong>Copy this key now.</strong> For security, it will never be shown again.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <code style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.4)', color: '#a78bfa', fontSize: '0.9rem', overflowX: 'auto', whiteSpace: 'nowrap', border: '1px solid var(--border-subtle)' }}>
                {newlyCreatedKey}
              </code>
              <button className="btn btn-primary" onClick={() => copyToClipboard(newlyCreatedKey)} style={{ padding: '0.75rem 1.25rem', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy</>}
              </button>
            </div>
            <button onClick={() => setNewlyCreatedKey(null)} style={{ marginTop: '1rem', background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: '0.85rem' }}>
              I've copied my key — dismiss
            </button>
          </div>
        )}

        {/* Create Key Section */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ margin: '0 0 0.25rem', fontSize: '1rem' }}>Your API Keys</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{keys.length} key{keys.length !== 1 ? 's' : ''} active</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem' }}
          >
            <Plus size={18} /> Create New Key
          </button>
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <>
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 50 }} onClick={() => setShowCreateModal(false)} />
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 51, width: '90%', maxWidth: '480px' }}>
              <div className="glass-panel" style={{ padding: '2rem', borderRadius: '1.25rem', border: '1px solid var(--border-subtle)' }}>
                <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.2rem' }}>Create New API Key</h3>
                {error && <p style={{ color: '#f87171', fontSize: '0.875rem', marginBottom: '0.75rem' }}>{error}</p>}
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Key Name</label>
                <input
                  value={newKeyName}
                  onChange={e => setNewKeyName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && createKey()}
                  placeholder="e.g. My Research App, Production, etc."
                  autoFocus
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '1rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: '1.25rem' }}
                />
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button className="btn btn-outline" onClick={() => setShowCreateModal(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={createKey} disabled={creating || !newKeyName.trim()}>
                    {creating ? 'Creating...' : 'Create Key'}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Keys List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' }}>
          {loading ? (
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', borderRadius: '1rem', color: 'var(--text-secondary)' }}>Loading keys...</div>
          ) : keys.length === 0 ? (
            <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', borderRadius: '1rem' }}>
              <Key size={40} color="var(--text-tertiary)" style={{ marginBottom: '1rem' }} />
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>No API keys yet. Create one to get started.</p>
            </div>
          ) : (
            keys.map(k => (
              <div key={k.id} className="glass-panel" style={{ padding: '1rem 1.25rem', borderRadius: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Key size={16} color="var(--accent-primary)" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{k.name}</div>
                    <code style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{k.key_prefix}</code>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>Created {new Date(k.created_at).toLocaleDateString()}</span>
                  <button
                    onClick={() => revokeKey(k.id)}
                    disabled={deletingId === k.id}
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.5rem', padding: '0.4rem 0.75rem', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', transition: 'all 0.2s' }}
                  >
                    <Trash2 size={14} /> {deletingId === k.id ? 'Revoking...' : 'Revoke'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Usage Docs */}
        <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '1rem', border: '1px solid rgba(139,92,246,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <Code size={20} color="var(--accent-primary)" />
            <h3 style={{ margin: 0, fontSize: '1.05rem' }}>How to Use Your API Key</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
            Pass your key in the <code style={{ color: 'var(--accent-primary)', background: 'rgba(139,92,246,0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>X-API-Key</code> header with any request to the research API:
          </p>
          <div style={{ position: 'relative' }}>
            <pre style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '0.75rem', padding: '1.25rem', overflowX: 'auto', color: '#a78bfa', fontSize: '0.83rem', border: '1px solid var(--border-subtle)', margin: 0 }}>
              {codeSnippet}
            </pre>
            <button
              onClick={() => copyToClipboard(codeSnippet)}
              style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '6px', padding: '0.35rem 0.6rem', color: 'var(--accent-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}
            >
              {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
            </button>
          </div>
          <div style={{ marginTop: '1.25rem', padding: '0.875rem 1rem', borderRadius: '0.75rem', background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', gap: '0.6rem' }}>
            <AlertTriangle size={16} color="#fbbf24" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ margin: 0, color: '#fbbf24', fontSize: '0.825rem' }}>
              Your API key carries the same privileges as your account. Keep it secret, keep it safe. Never expose it in public GitHub repos or client-side code.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
