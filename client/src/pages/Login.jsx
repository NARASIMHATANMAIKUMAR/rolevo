import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import api, { getErrorMessage } from '../api/axios';
import { useAuth } from '../context/AuthContext';

function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Already logged in -> no need to see this page
  if (user) return <Navigate to="/" replace />;

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
      navigate('/');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-panel panel">
      <div style={{ marginBottom: '14px' }}>
        <Link to="/tour" className="small muted" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          ← Explore Rolevo Feature Tour
        </Link>
      </div>

      <h1 className="page-title">Sign in to Rolevo</h1>
      <p className="auth-subtitle">Welcome back! Sign in to continue tracking your applications.</p>

      <div className="demo-box">
        <div>
          <strong>⚡ Quick Demo:</strong> Narasimha
        </div>
        <button type="button" onClick={fillDemo} title="Click to prefill demo credentials">
          Auto-fill
        </button>
      </div>

      {error && <div className="alert">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        <label>
          Email address
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@domain.com"
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
        </label>
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '6px' }}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '16px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
        <p className="small muted" style={{ margin: '0 0 8px' }}>
          Don't have an account yet?
        </p>
        <Link to="/register" className="btn btn-small" style={{ width: '100%' }}>
          Register for Free
        </Link>
      </div>
    </div>
  );
}

export default Login;
