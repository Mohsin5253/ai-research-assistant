import { useParams } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function Legal() {
  const { document } = useParams();

  const getTitle = () => {
    switch (document) {
      case 'privacy': return 'Privacy Policy';
      case 'terms': return 'Terms of Service';
      case 'cookies': return 'Cookie Policy';
      case 'security': return 'Security';
      default: return 'Legal Information';
    }
  };

  const getContent = () => {
    switch (document) {
      case 'privacy':
        return (
          <>
            <h3>1. Data Collection</h3>
            <p>We collect information to provide better services to our users. This includes basic account info and search queries for the research platform.</p>
            <h3>2. Data Usage</h3>
            <p>Your data is strictly used for powering the AI research tools. We do not sell your personal data to third parties.</p>
          </>
        );
      case 'terms':
        return (
          <>
            <h3>1. Acceptance of Terms</h3>
            <p>By using NexusAI Research Systems, you agree to these terms of service. If you disagree with any part, you may not access the service.</p>
            <h3>2. User Responsibilities</h3>
            <p>You are responsible for maintaining the confidentiality of your account credentials and for any activities under your account.</p>
          </>
        );
      case 'cookies':
        return (
          <>
            <h3>1. What are Cookies?</h3>
            <p>Cookies are small pieces of text sent to your browser to help our platform remember information about your visit.</p>
            <h3>2. How We Use Them</h3>
            <p>We use session cookies strictly for authentication and keeping you logged into the NexusAI dashboard.</p>
          </>
        );
      case 'security':
        return (
          <>
            <h3>1. Data Protection</h3>
            <p>We use industry-standard encryption protocols to ensure that your research data and credentials remain secure.</p>
            <h3>2. Vulnerability Reporting</h3>
            <p>If you believe you have found a security vulnerability, please contact our support team immediately.</p>
          </>
        );
      default:
        return <p>Legal document not found.</p>;
    }
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '4rem' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }} className="animate-fade-in">
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}>
            <Shield size={36} color="white" />
          </div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', marginBottom: '0.75rem' }}>
            <span className="text-gradient">{getTitle()}</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="glass-panel animate-fade-in" style={{ padding: 'clamp(1.5rem, 4vw, 3rem)', borderRadius: '1.5rem', color: 'var(--text-primary)', lineHeight: 1.8 }}>
          {getContent()}
          <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            If you have any questions regarding these documents, please contact legal@nexusai.com.
          </div>
        </div>
      </div>
    </div>
  );
}
