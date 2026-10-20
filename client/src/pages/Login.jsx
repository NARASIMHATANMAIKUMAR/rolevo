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
      <h1 className="page-title">Sign in to Rolevo</h1>
      <p className="auth-subtitle">Track your job applications, interviews, and offers</p>

      <div className="demo-box">
        <div>
          <strong>Demo Login:</strong> Narasimha
        </div>
        <button type="button" onClick={fillDemo}>
          Auto-fill
        </button>
      </div>

      {error && <div className="alert">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        <label>
          Email address
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </label>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <p className="small muted">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default Login;
