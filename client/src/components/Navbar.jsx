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
        <Link to="/" className="brand">
          <span className="brand-icon">R</span>
          <span className="brand-name">Rolevo</span>
        </Link>

        {user ? (
          <div className="topbar-user">
            <span className="user-badge">
              <span className="user-avatar">{initial}</span>
              <span>{user.name}</span>
            </span>
            <button className="btn btn-small" onClick={handleLogout} title="Sign out of Rolevo">
              Logout
            </button>
          </div>
        ) : (
          <div className="topbar-user">
            <Link to="/login" className="btn btn-small" style={{ border: 'none', background: 'transparent' }}>
              Sign In
            </Link>
            <Link to="/register" className="btn btn-primary btn-small">
              Register for Free
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
