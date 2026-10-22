import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-meta">
          <span className="footer-brand">Rolevo</span>
          <span className="footer-tagline">Job Application Tracking System</span>
          <span className="footer-copy">© {currentYear} All rights reserved.</span>
        </div>

        <nav className="footer-nav" aria-label="Legal and documentation links">
          <Link to="/privacy" className="footer-link">Privacy Policy</Link>
          <span className="footer-sep" aria-hidden="true">•</span>
          <Link to="/terms" className="footer-link">Terms and Conditions</Link>
          <span className="footer-sep" aria-hidden="true">•</span>
          <a
            href="https://github.com/narasimhatanmaikumar/rolevo"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            GitHub Repository
          </a>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
