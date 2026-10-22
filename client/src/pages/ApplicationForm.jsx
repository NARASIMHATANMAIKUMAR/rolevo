import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../api/axios';
import { IconArrowLeft, IconStar } from '../components/Icons';
import { STATUSES, toInputDate, todayInputDate } from '../utils/helpers';

// Shared form component for Add (/applications/new) and Edit (/applications/:id/edit)
function ApplicationForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    company: '',
    role: '',
    jobLink: '',
    location: '',
    salaryExpectation: '',
    appliedDate: todayInputDate(),
    status: 'Applied',
    interviewDate: '',
    notes: '',
    isStarred: false,
  });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // When editing, fetch existing application record
  useEffect(() => {
    if (!isEdit) return;
    async function load() {
      try {
        const res = await api.get(`/applications/${id}`);
        const app = res.data;
        setForm({
          company: app.company,
          role: app.role,
          jobLink: app.jobLink || '',
          location: app.location || '',
          salaryExpectation: app.salaryExpectation || '',
          appliedDate: toInputDate(app.appliedDate),
          status: app.status,
          interviewDate: toInputDate(app.interviewDate),
          notes: app.notes || '',
          isStarred: Boolean(app.isStarred),
        });
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, isEdit]);

  function handleChange(e) {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.company.trim() || !form.role.trim() || !form.appliedDate) {
      setError('Company name, role, and applied date are required fields.');
      return;
    }

    const payload = { ...form, interviewDate: form.interviewDate || null };
    if (isEdit) delete payload.status; // status is modified via status transitions

    setSaving(true);
    try {
      const res = isEdit
        ? await api.put(`/applications/${id}`, payload)
        : await api.post('/applications', payload);
      navigate(`/applications/${res.data._id}`);
    } catch (err) {
      setError(getErrorMessage(err));
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="panel loading-state">
        <p className="muted">Loading application details...</p>
      </div>
    );
  }

  return (
    <div className="form-page-wrap">
      <div className="form-breadcrumb">
        <Link to={isEdit ? `/applications/${id}` : '/'} className="breadcrumb-link">
          <IconArrowLeft size={14} /> Back to {isEdit ? 'Details' : 'Applications'}
        </Link>
      </div>

      <div className="panel form-panel">
        <div className="page-header form-header">
          <div>
            <h1 className="page-title">{isEdit ? 'Edit Application' : 'Add New Application'}</h1>
            <p className="page-subtitle">
              {isEdit ? 'Update role details, dates, and salary expectations' : 'Record an active job application in your pipeline'}
            </p>
          </div>
          <Link to={isEdit ? `/applications/${id}` : '/'} className="btn btn-secondary btn-small">
            Cancel
          </Link>
        </div>

        {error && <div className="alert">{error}</div>}

        <form onSubmit={handleSubmit} className="form form-grid">
          <label>
            <span>Company Name *</span>
            <input
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="e.g. Google, Microsoft, Zoho"
              required
            />
          </label>

          <label>
            <span>Role / Position *</span>
            <input
              name="role"
              value={form.role}
              onChange={handleChange}
              placeholder="e.g. Software Development Engineer"
              required
            />
          </label>

          <label>
            <span>Location</span>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Bengaluru / Remote / Hybrid"
            />
          </label>

          <label>
            <span>Salary / CTC Expectation</span>
            <input
              name="salaryExpectation"
              value={form.salaryExpectation}
              onChange={handleChange}
              placeholder="e.g. 18 to 22 LPA"
            />
          </label>

          <label className="span-2">
            <span>Job Posting URL</span>
            <input
              type="url"
              name="jobLink"
              value={form.jobLink}
              onChange={handleChange}
              placeholder="https://careers.company.com/job/..."
            />
          </label>

          <label>
            <span>Applied Date *</span>
            <input
              type="date"
              name="appliedDate"
              value={form.appliedDate}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            <span>Interview Date (if scheduled)</span>
            <input
              type="date"
              name="interviewDate"
              value={form.interviewDate}
              onChange={handleChange}
            />
          </label>

          {!isEdit && (
            <label className="span-2">
              <span>Initial Pipeline Status</span>
              <select name="status" value={form.status} onChange={handleChange}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
          )}

          <div className="span-2 checkbox-card">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isStarred"
                checked={form.isStarred}
                onChange={handleChange}
                className="checkbox-input"
              />
              <span className="checkbox-text">
                <IconStar filled={form.isStarred} size={15} />
                <span>Bookmark as Priority Target Company</span>
              </span>
            </label>
          </div>

          <label className="span-2">
            <span>Preparation Notes and Strategy</span>
            <textarea
              name="notes"
              rows="4"
              value={form.notes}
              onChange={handleChange}
              placeholder="Key talking points, recruiter contacts, tech stack requirements, or interview prep focus..."
            />
          </label>

          <div className="span-2 form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : isEdit ? 'Save Application Changes' : 'Create Application'}
            </button>
            <Link to={isEdit ? `/applications/${id}` : '/'} className="btn btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ApplicationForm;
