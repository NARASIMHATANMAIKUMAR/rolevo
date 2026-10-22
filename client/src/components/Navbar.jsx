import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link to="/" className="brand" aria-label="Rolevo home">
          <span className="brand-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 21V3h8a5 5 0 0 1 5 5 5 5 0 0 1-5 5H4" />
              <line x1="12" y1="13" x2="20" y2="21" />
            </svg>
          </span>
          <span className="brand-name">Rolevo</span>
          <span className="brand-badge">Tracker</span>
        </Link>

        {user ? (
          <div className="topbar-user">
            <span className="user-badge" title={`Signed in as ${user.email}`}>
              <span className="user-avatar" aria-hidden="true">{initial}</span>
              <span className="user-name">{user.name}</span>
            </span>
            <button
              type="button"
              className="btn btn-secondary btn-small"
              onClick={handleLogout}
              title="Sign out of your session"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="topbar-user">
            <Link to="/login" className="btn btn-secondary btn-small">
              Sign In
            </Link>
            <Link to="/register" className="btn btn-primary btn-small">
              Create Account
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
