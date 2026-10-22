import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { getErrorMessage } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  IconBriefcase,
  IconClock,
  IconTrendingUp,
  IconShield,
  IconArrowLeft,
  IconKanban,
  IconDownload
} from '../components/Icons';

function Landing() {
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoError, setDemoError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleLaunchDemo() {
    setDemoLoading(true);
    setDemoError('');
    try {
      const res = await api.post('/auth/login', {
        email: 'narasimhatanmaikumar@gmail.com',
        password: 'rolevo123',
      });
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setDemoError(getErrorMessage(err));
    } finally {
      setDemoLoading(false);
    }
  }

  return (
    <div className="landing-container">
      {/* System Hero Header */}
      <section className="landing-hero-section">
        <div className="landing-tag">Engineering Mini-Project : MERN Stack Architecture</div>
        <h1 className="landing-headline">
          A structured, private workspace for tracking your career pipeline
        </h1>
        <p className="landing-description">
          Monitor application stages, interview schedules, response rates, and follow-up timelines in a focused, tenant-isolated dashboard.
        </p>

        {demoError && (
          <div className="alert" style={{ maxWidth: '480px', margin: '0 auto 16px' }}>
            {demoError}
          </div>
        )}

        <div className="landing-action-group">
          <Link to="/login" className="btn btn-primary btn-large">
            Sign In to Workspace
          </Link>
          <button
            type="button"
            className="btn btn-secondary btn-large"
            onClick={handleLaunchDemo}
            disabled={demoLoading}
            title="Authenticate with demo account data"
          >
            {demoLoading ? 'Connecting to Demo...' : 'Open Live Demo Account'}
          </button>
          <Link to="/register" className="btn btn-secondary btn-large">
            Create Account
          </Link>
        </div>
      </section>

      {/* Technical Workflow Pillars */}
      <section className="landing-pillars-grid" aria-label="System capabilities">
        <div className="pillar-card">
          <div className="pillar-icon">
            <IconKanban size={20} />
          </div>
          <h2 className="pillar-title">Dual View Workflow</h2>
          <p className="pillar-body">
            Switch seamlessly between a spreadsheet-style data table and a 4-column visual Kanban board. Filter by status, search by role or company, and toggle priority bookmarks.
          </p>
        </div>

        <div className="pillar-card">
          <div className="pillar-icon">
            <IconClock size={20} />
          </div>
          <h2 className="pillar-title">7-Day Follow-Up Alert</h2>
          <p className="pillar-body">
            Automatically flags applications that remain in Applied status for more than 7 days. Computed dynamically on runtime without unnecessary background polling jobs.
          </p>
        </div>

        <div className="pillar-card">
          <div className="pillar-icon">
            <IconTrendingUp size={20} />
          </div>
          <h2 className="pillar-title">Server-Side Aggregation</h2>
          <p className="pillar-body">
            Real-time pipeline metrics and response rate percentages calculated directly by MongoDB aggregation pipelines ($match and $group), minimizing server memory overhead.
          </p>
        </div>

        <div className="pillar-card">
          <div className="pillar-icon">
            <IconDownload size={20} />
          </div>
          <h2 className="pillar-title">RFC 4180 CSV Export</h2>
          <p className="pillar-body">
            Generate clean, formatted application reports with a single click. Exports company details, roles, salary expectations, interview schedules, and notes for offline records.
          </p>
        </div>

        <div className="pillar-card">
          <div className="pillar-icon">
            <IconBriefcase size={20} />
          </div>
          <h2 className="pillar-title">Lifecycle Audit Timeline</h2>
          <p className="pillar-body">
            Every status transition logs a timestamped subdocument in an embedded array. Review chronological progression from initial submission to final offer decision.
          </p>
        </div>

        <div className="pillar-card">
          <div className="pillar-icon">
            <IconShield size={20} />
          </div>
          <h2 className="pillar-title">Tenant Data Isolation</h2>
          <p className="pillar-body">
            Stateless JWT authentication combined with strict database query constraints. Every database operation enforces verified ownership, preventing unauthorized record access.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Landing;
