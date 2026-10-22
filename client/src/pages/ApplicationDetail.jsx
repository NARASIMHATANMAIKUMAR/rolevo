import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../api/axios';
import StatusSelect from '../components/StatusSelect';
import FollowUpLabel from '../components/FollowUpLabel';
import Timeline from '../components/Timeline';
import {
  IconArrowLeft,
  IconStar,
  IconEdit,
  IconTrash,
  IconExternalLink,
  IconCheckCircle
} from '../components/Icons';
import { formatDate } from '../utils/helpers';

function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
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
    if (!window.confirm(`Are you sure you want to delete the application record for ${application.company}?`)) {
      return;
    }

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

  if (loading) {
    return (
      <div className="panel loading-state">
        <p className="muted">Loading application details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="alert">{error}</div>
        <Link to="/" className="btn btn-secondary">
          <IconArrowLeft size={14} /> Back to Applications
        </Link>
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
    <div className="detail-page-wrap">
      <div className="detail-breadcrumb">
        <Link to="/" className="breadcrumb-link">
          <IconArrowLeft size={14} /> Back to Applications
        </Link>
      </div>

      <div className="page-header detail-header">
        <div>
          <div className="detail-title-row">
            <h1 className="page-title">{application.company}</h1>
            {application.isStarred && (
              <span className="badge-starred">
                <IconStar filled size={12} aria-hidden="true" />
                <span>Priority Target</span>
              </span>
            )}
            <FollowUpLabel application={application} />
          </div>
          <p className="detail-role-subtitle">{application.role}</p>
        </div>
        <div className="actions">
          <button
            type="button"
            className={`btn btn-secondary ${application.isStarred ? 'btn-star-active' : ''}`}
            onClick={handleToggleStar}
            title={application.isStarred ? 'Remove from priority targets' : 'Bookmark as priority target'}
          >
            <IconStar filled={Boolean(application.isStarred)} size={14} />
            <span>{application.isStarred ? 'Priority Target' : 'Mark Priority'}</span>
          </button>
          <Link to={`/applications/${id}/edit`} className="btn btn-secondary">
            <IconEdit size={14} /> Edit
          </Link>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={deleting}
          >
            <IconTrash size={14} />
            <span>{deleting ? 'Deleting...' : 'Delete'}</span>
          </button>
        </div>
      </div>

      {actionError && <div className="alert">{actionError}</div>}

      {/* Visual Pipeline Stepper */}
      <div className="pipeline-stepper" role="region" aria-label="Application lifecycle progress">
        {steps.map((st, idx) => {
          const isCompleted = getStepClass(st.key).includes('completed');
          const isActive = getStepClass(st.key).includes('active');
          return (
            <div className={getStepClass(st.key)} key={st.key}>
              <div className="step-node" aria-hidden="true">
                {isCompleted ? <IconCheckCircle size={14} /> : idx + 1}
              </div>
              <span className="step-label">{st.label}</span>
            </div>
          );
        })}
      </div>

      <div className="detail-layout">
        <section className="panel detail-meta-panel">
          <h2 className="section-title">Application Details</h2>
          <dl className="details">
            <dt>Current Status</dt>
            <dd className="status-update-cell">
              <StatusSelect
                value={application.status}
                onChange={handleStatusChange}
                disabled={updating}
              />
              {updating && <span className="muted small">Saving...</span>}
            </dd>

            <dt>Applied Date</dt>
            <dd>{formatDate(application.appliedDate)}</dd>

            <dt>Interview Date</dt>
            <dd>
              {application.interviewDate ? (
                <span className="interview-highlight">
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
                  className="external-job-link"
                >
                  <span>{application.jobLink}</span>
                  <IconExternalLink size={13} aria-hidden="true" />
                </a>
              ) : (
                <span className="muted">-</span>
              )}
            </dd>

            <dt>Personal Notes</dt>
            <dd className="notes-block">
              {application.notes ? (
                <p>{application.notes}</p>
              ) : (
                <span className="muted">No interview preparation or recruiter notes recorded.</span>
              )}
            </dd>
          </dl>
        </section>

        <section className="panel detail-history-panel">
          <h2 className="section-title">Status Audit Trail</h2>
          <Timeline history={application.statusHistory} />
        </section>
      </div>
    </div>
  );
}

export default ApplicationDetail;
