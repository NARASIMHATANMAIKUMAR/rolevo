import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../api/axios';
import StatusSelect from '../components/StatusSelect';
import FollowUpLabel from '../components/FollowUpLabel';
import Timeline from '../components/Timeline';
import { formatDate } from '../utils/helpers';

function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); // error while loading the page
  const [actionError, setActionError] = useState(''); // error from status change / delete
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await api.get(`/applications/${id}`);
        setApplication(res.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleStatusChange(status) {
    setUpdating(true);
    setActionError('');
    try {
      const res = await api.patch(`/applications/${id}/status`, { status });
      setApplication(res.data);
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setUpdating(false);
    }
  }

  async function handleToggleStar() {
    setActionError('');
    try {
      const res = await api.patch(`/applications/${id}/star`);
      setApplication(res.data);
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Delete the application for ${application.company}?`)) return;

    setDeleting(true);
    setActionError('');
    try {
      await api.delete(`/applications/${id}`);
      navigate('/');
    } catch (err) {
      setActionError(getErrorMessage(err));
      setDeleting(false);
    }
  }

  if (loading) return <p className="muted" style={{ padding: '32px', textAlign: 'center' }}>Loading application details...</p>;

  if (error) {
    return (
      <div style={{ maxWidth: '600px', margin: '40px auto' }}>
        <div className="alert">{error}</div>
        <Link to="/" className="btn">← Back to applications</Link>
      </div>
    );
  }

  // Calculate step state for pipeline stepper
  const currentStatus = application.status;
  const isRejected = currentStatus === 'Rejected';
  const steps = isRejected
    ? [
        { label: 'Applied', key: 'Applied' },
        { label: 'Screen / Interview', key: 'Interview' },
        { label: 'Archived / Rejected', key: 'Rejected' },
      ]
    : [
        { label: 'Applied', key: 'Applied' },
        { label: 'Interview Scheduled', key: 'Interview' },
        { label: 'Offer Received', key: 'Offer' },
      ];

  const getStepClass = (stepKey) => {
    if (stepKey === currentStatus) return 'step-item active';
    if (currentStatus === 'Offer' && (stepKey === 'Applied' || stepKey === 'Interview')) return 'step-item completed';
    if (currentStatus === 'Interview' && stepKey === 'Applied') return 'step-item completed';
    return 'step-item';
  };

  return (
    <div>
      <p className="small" style={{ marginBottom: '16px' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          ← Back to applications
        </Link>
      </p>

      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span>{application.company}</span>
            {application.isStarred && <span className="badge-starred">⭐ Dream Company</span>}
            <FollowUpLabel application={application} />
          </h1>
          <div className="muted" style={{ fontSize: '15px', marginTop: '4px' }}>
            {application.role}
          </div>
        </div>
        <div className="actions">
          <button
            type="button"
            className={`btn ${application.isStarred ? 'btn-filter-star active' : ''}`}
            onClick={handleToggleStar}
            title="Toggle dream company bookmark"
          >
            <span>{application.isStarred ? '⭐ Starred' : '☆ Star'}</span>
          </button>
          <Link to={`/applications/${id}/edit`} className="btn">
            ✏️ Edit
          </Link>
          <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting...' : '🗑️ Delete'}
          </button>
        </div>
      </div>

      {actionError && <div className="alert">{actionError}</div>}

      {/* Visual Pipeline Stepper */}
      <div className="pipeline-stepper">
        {steps.map((st, idx) => (
          <div className={getStepClass(st.key)} key={st.key}>
            <div className="step-node">
              {st.key === currentStatus ? '●' : idx + 1}
            </div>
            <span className="step-label">{st.label}</span>
          </div>
        ))}
      </div>

      <div className="detail-layout">
        <section className="panel">
          <h2 className="section-title">Application Details</h2>
          <dl className="details">
            <dt>Current Status</dt>
            <dd style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <StatusSelect value={application.status} onChange={handleStatusChange} disabled={updating} />
              {updating && <span className="muted small">Updating...</span>}
            </dd>

            <dt>Applied Date</dt>
            <dd>{formatDate(application.appliedDate)}</dd>

            <dt>Interview Date</dt>
            <dd>
              {application.interviewDate ? (
                <span style={{ fontWeight: 600, color: 'var(--interview)' }}>
                  {formatDate(application.interviewDate)}
                </span>
              ) : (
                <span className="muted">-</span>
              )}
            </dd>

            <dt>Location</dt>
            <dd>{application.location || <span className="muted">-</span>}</dd>

            <dt>Salary / CTC</dt>
            <dd>
              {application.salaryExpectation ? (
                <span className="salary-tag">{application.salaryExpectation}</span>
              ) : (
                <span className="muted">-</span>
              )}
            </dd>

            <dt>Job Link</dt>
            <dd>
              {application.jobLink ? (
                <a
                  href={application.jobLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ wordBreak: 'break-all' }}
                >
                  🔗 {application.jobLink}
                </a>
              ) : (
                <span className="muted">-</span>
              )}
            </dd>

            <dt>Personal Notes</dt>
            <dd className="notes">{application.notes || 'No notes added yet.'}</dd>
          </dl>
        </section>

        <section className="panel">
          <h2 className="section-title">Stage History</h2>
          <Timeline history={application.statusHistory} />
        </section>
      </div>
    </div>
  );
}

export default ApplicationDetail;
