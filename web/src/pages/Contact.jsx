import { useState } from 'react';
import { Mail, ExternalLink, Clock, Send, Loader2, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Build mailto link and open it
    const mailtoSubject = encodeURIComponent(form.subject || 'Contact from NexusAI');
    const mailtoBody = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    window.open(`mailto:mohsinsidhpurwala04@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`, '_self');
    await new Promise(res => setTimeout(res, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  const contactMethods = [
    { icon: <Mail size={24} />, title: 'Email', value: 'mohsinsidhpurwala04@gmail.com', sub: 'Drop me an email anytime', color: '#6366f1', href: 'mailto:mohsinsidhpurwala04@gmail.com' },
    { icon: <ExternalLink size={24} />, title: 'LinkedIn', value: 'Mohsin Sidhpurwala', sub: 'Let\'s connect professionally', color: '#0a66c2', href: 'https://www.linkedin.com/in/mohsin-sidhpurwala-084927375/' },
    { icon: <Clock size={24} />, title: 'Response Time', value: '< 24 hours', sub: 'For all inquiries', color: '#10b981' },
  ];

  return (
    <div style={{ paddingTop: '80px' }}>
      {/* Hero */}
      <section style={{ padding: 'clamp(4rem, 10vw, 7rem) 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="hero-bg-glow" style={{ opacity: 0.4 }} />
        <div className="container animate-fade-in" style={{ position: 'relative', zIndex: 1 }}>
          <span style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Get In Touch</span>
          <h1 style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', margin: '1rem 0' }}>
            Let's <span className="text-gradient">Talk</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto', fontSize: 'clamp(1rem, 2.5vw, 1.15rem)' }}>
            Whether you have a question, a partnership proposal, or just want to see a demo — we'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <div style={{ background: 'var(--bg-secondary)', padding: 'clamp(2rem, 5vw, 3rem) 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {contactMethods.map((m, i) => {
              const card = (
                <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', cursor: m.href ? 'pointer' : 'default', transition: 'transform 0.2s, border-color 0.2s', border: '1px solid var(--border-subtle)' }}
                  onMouseEnter={e => { if (m.href) { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = m.color; } }}
                  onMouseLeave={e => { if (m.href) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; } }}
                >
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '0.875rem',
                    background: `${m.color}22`, border: `1px solid ${m.color}33`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1rem', color: m.color,
                  }}>{m.icon}</div>
                  <h4 style={{ marginBottom: '0.25rem', fontSize: '0.95rem' }}>{m.title}</h4>
                  <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem', wordBreak: 'break-all' }}>{m.value}</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{m.sub}</p>
                </div>
              );
              return m.href ? (
                <a key={i} href={m.href} target={m.href.startsWith('mailto') ? '_self' : '_blank'} rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>{card}</a>
              ) : (
                <div key={i}>{card}</div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <section style={{ padding: 'clamp(3rem, 8vw, 6rem) 0' }}>
        <div className="container" style={{ maxWidth: '700px' }}>
          {submitted ? (
            <div className="glass-panel animate-fade-in" style={{ padding: 'clamp(2rem, 6vw, 4rem)', textAlign: 'center', borderRadius: '1.5rem' }}>
              <CheckCircle size={64} color="#10b981" style={{ margin: '0 auto 1.5rem', display: 'block' }} />
              <h2 style={{ marginBottom: '0.75rem' }}>Message Sent!</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                Thanks for reaching out, <strong style={{ color: 'var(--accent-primary)' }}>{form.name}</strong>! We've received your message and will get back to you at {form.email} within 24 hours.
              </p>
              <button className="btn btn-outline" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }} style={{ marginTop: '2rem' }}>
                Send Another
              </button>
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: 'clamp(1.5rem, 5vw, 3rem)', borderRadius: '1.5rem' }}>
              <h2 style={{ marginBottom: '0.5rem', fontSize: 'clamp(1.25rem, 3vw, 1.75rem)' }}>Send us a Message</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>Fill out the form and we'll get back to you shortly.</p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                  {[
                    { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Your name' },
                    { label: 'Email Address', key: 'email', type: 'email', placeholder: 'you@example.com' },
                  ].map(field => (
                    <div key={field.key}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>{field.label}</label>
                      <input
                        type={field.type} required
                        placeholder={field.placeholder}
                        value={form[field.key]}
                        onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))}
                        style={{
                          width: '100%', padding: '0.875rem 1rem', borderRadius: '0.75rem',
                          border: '1px solid var(--border-subtle)',
                          background: 'rgba(255,255,255,0.05)',
                          color: 'white', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Subject</label>
                  <select
                    value={form.subject}
                    onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                    required
                    style={{
                      width: '100%', padding: '0.875rem 1rem', borderRadius: '0.75rem',
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-secondary)', color: 'white',
                      fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box',
                    }}
                  >
                    <option value="">Select a subject...</option>
                    <option>General Inquiry</option>
                    <option>Sales / Enterprise</option>
                    <option>Technical Support</option>
                    <option>Partnership</option>
                    <option>Press / Media</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Message</label>
                  <textarea
                    required rows={5}
                    placeholder="Tell us how we can help..."
                    value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    style={{
                      width: '100%', padding: '0.875rem 1rem', borderRadius: '0.75rem',
                      border: '1px solid var(--border-subtle)',
                      background: 'rgba(255,255,255,0.05)', color: 'white',
                      fontSize: '0.95rem', outline: 'none', resize: 'vertical',
                      boxSizing: 'border-box', fontFamily: 'inherit',
                    }}
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading} style={{ justifyContent: 'center', padding: '1rem', fontSize: '1rem' }}>
                  {loading ? <><Loader2 size={18} className="animate-spin" /> Sending...</> : <><Send size={18} /> Send Message</>}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
