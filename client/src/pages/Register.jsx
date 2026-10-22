import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import api, { getErrorMessage } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { IconArrowLeft, IconLock } from '../components/Icons';

function Register() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (user) return <Navigate to="/dashboard" replace />;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (form.password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/register', form);
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-panel panel">
        <div className="auth-top-nav">
          <Link to="/" className="breadcrumb-link">
            <IconArrowLeft size={14} /> Back to Overview
          </Link>
        </div>

        <div className="auth-header">
          <div className="auth-icon-wrap" aria-hidden="true">
            <IconLock size={20} />
          </div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">
            Set up your private workspace to track job applications and interview schedules.
          </p>
        </div>

        {error && <div className="alert">{error}</div>}

        <form onSubmit={handleSubmit} className="form">
          <label>
            <span>Full Name</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Alex Morgan"
              autoComplete="name"
              required
            />
          </label>
          <label>
            <span>Email Address</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@domain.com"
              autoComplete="email"
              required
            />
          </label>
          <label>
            <span>Password <span className="muted">(min 6 characters)</span></span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="new-password"
              required
            />
          </label>

          <p className="auth-terms-note">
            By creating an account, you agree to the <Link to="/terms">Terms and Conditions</Link> and <Link to="/privacy">Privacy Policy</Link>.
          </p>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '4px' }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer-nav">
          <p className="small muted">Already have an account?</p>
          <Link to="/login" className="btn btn-secondary btn-small" style={{ width: '100%' }}>
            Sign In to Existing Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
