import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../api/axios';
import { STATUSES, toInputDate, todayInputDate } from '../utils/helpers';

// Same page is used for Add (/applications/new) and Edit (/applications/:id/edit)
function ApplicationForm() {
  const { id } = useParams();
  const isEdit = Boolean(id); // there is an id in the URL -> we are editing
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
  const [loading, setLoading] = useState(isEdit); // only need to load data when editing
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // In edit mode, load the existing application and fill the form
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
      setError('Company, role and applied date are required');
      return;
    }

    const payload = { ...form, interviewDate: form.interviewDate || null };
    if (isEdit) delete payload.status; // status is changed with PATCH, not with edit

    setSaving(true);
    try {
      const res = isEdit
        ? await api.put(`/applications/${id}`, payload)
        : await api.post('/applications', payload);
      navigate(`/applications/${res.data._id}`); // go to the detail page
    } catch (err) {
      setError(getErrorMessage(err));
      setSaving(false);
    }
  }

  if (loading) return <p className="muted" style={{ padding: '32px', textAlign: 'center' }}>Loading application...</p>;

  return (
    <div className="panel form-panel" style={{ margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: '20px' }}>
        <div>
          <h1 className="page-title">{isEdit ? 'Edit Application' : 'Add New Application'}</h1>
          <p className="muted small" style={{ margin: '2px 0 0' }}>
            {isEdit ? 'Update details and salary expectations' : 'Track an active job application'}
          </p>
        </div>
        <Link to={isEdit ? `/applications/${id}` : '/'} className="btn btn-small">
          Cancel
        </Link>
      </div>

      {error && <div className="alert">{error}</div>}

      <form onSubmit={handleSubmit} className="form form-grid">
        <label>
          Company Name *
          <input name="company" value={form.company} onChange={handleChange} placeholder="e.g. Google" required />
        </label>
        <label>
          Role / Job Title *
          <input name="role" value={form.role} onChange={handleChange} placeholder="e.g. Senior Frontend Engineer" required />
        </label>
        <label>
          Location
          <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Remote / Bengaluru" />
        </label>
        <label>
          Salary / CTC Expectation
          <input name="salaryExpectation" value={form.salaryExpectation} onChange={handleChange} placeholder="e.g. 18 - 22 LPA" />
        </label>
        <label className="span-2">
          Job Posting Link
          <input type="url" name="jobLink" value={form.jobLink} onChange={handleChange} placeholder="https://careers.company.com/job/..." />
        </label>
        <label>
          Applied Date *
          <input type="date" name="appliedDate" value={form.appliedDate} onChange={handleChange} required />
        </label>
        <label>
          Interview Date (if scheduled)
          <input type="date" name="interviewDate" value={form.interviewDate} onChange={handleChange} />
        </label>

        {/* Status is only chosen when adding. After that it changes from the dropdown on the detail page. */}
        {!isEdit && (
          <label>
            Initial Status
            <select name="status" value={form.status} onChange={handleChange}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        )}

        <label
          className="span-2"
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            background: 'var(--lavender-light)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--lavender-border)',
          }}
        >
          <input
            type="checkbox"
            name="isStarred"
            checked={form.isStarred}
            onChange={handleChange}
            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--mocha-primary)' }}
          />
          <span style={{ fontWeight: 600, color: 'var(--text)' }}>
            ⭐ Priority Bookmark: Mark as a Dream Company
          </span>
        </label>

        <label className="span-2">
          Notes & Preparation Strategy
          <textarea
            name="notes"
            rows="4"
            value={form.notes}
            onChange={handleChange}
            placeholder="Key talking points, referral contact, recruiter name, or tech stack requirements..."
          />
        </label>

        <div className="span-2" style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Application'}
          </button>
          <Link to={isEdit ? `/applications/${id}` : '/'} className="btn">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default ApplicationForm;
