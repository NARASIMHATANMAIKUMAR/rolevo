import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import api, { getErrorMessage } from '../api/axios';
import { useAuth } from '../context/AuthContext';

function Register() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (user) return <Navigate to="/" replace />;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // Quick check on the client; the server checks again
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/register', form);
      login(res.data.token, res.data.user); // register also logs the user in
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

      <h1 className="page-title">Create your Rolevo account</h1>
      <p className="auth-subtitle">Join Rolevo to organize and track your career growth with total clarity.</p>

      {error && <div className="alert">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        <label>
          Full Name
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Alex Morgan"
            required
          />
        </label>
        <label>
          Email Address
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
          Password <span className="muted">(min 6 characters)</span>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Create a secure password"
            required
          />
        </label>
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '6px' }}>
          {loading ? 'Creating Account...' : 'Register for Free 🚀'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '16px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
        <p className="small muted" style={{ margin: '0 0 8px' }}>
          Already have an account?
        </p>
        <Link to="/login" className="btn btn-small" style={{ width: '100%' }}>
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default Register;
