import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link to="/" className="brand">
          <span className="brand-icon">R</span>
          <span className="brand-name">Rolevo</span>
        </Link>
        {user && (
          <div className="topbar-user">
            <span className="user-badge">
              <span>👤</span> {user.name}
            </span>
            <button className="btn btn-small" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
