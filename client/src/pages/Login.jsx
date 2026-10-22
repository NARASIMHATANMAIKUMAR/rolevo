import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import api, { getErrorMessage } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { IconArrowLeft, IconLock } from '../components/Icons';

function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (user) return <Navigate to="/dashboard" replace />;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function fillDemo() {
    setForm({
      email: 'narasimhatanmaikumar@gmail.com',
      password: 'rolevo123',
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
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
          <h1 className="auth-title">Sign In to Rolevo</h1>
          <p className="auth-subtitle">
            Enter your account credentials to access your job tracking workspace.
          </p>
        </div>

        <div className="demo-box" role="region" aria-label="Demo login shortcut">
          <div className="demo-box-info">
            <span className="demo-box-label">Evaluation Demo Account:</span>
            <span className="demo-box-user">Narasimha (Pre-loaded data)</span>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-small"
            onClick={fillDemo}
            title="Auto-fill evaluation credentials"
          >
            Auto-fill
          </button>
        </div>

        {error && <div className="alert">{error}</div>}

        <form onSubmit={handleSubmit} className="form">
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
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </label>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '6px' }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer-nav">
          <p className="small muted">Need a new account?</p>
          <Link to="/register" className="btn btn-secondary btn-small" style={{ width: '100%' }}>
            Create New Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
