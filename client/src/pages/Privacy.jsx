import { Link } from 'react-router-dom';
import { IconArrowLeft, IconShield } from '../components/Icons';

function Privacy() {
  return (
    <div className="legal-container">
      <div className="legal-header">
        <Link to="/" className="btn btn-secondary btn-small">
          <IconArrowLeft size={14} /> Back to Application
        </Link>
        <div className="legal-title-group">
          <div className="legal-badge">
            <IconShield size={14} /> Privacy Policy
          </div>
          <h1 className="legal-title">Privacy Policy</h1>
          <p className="legal-meta">Effective Date: October 2026 | Version 1.0</p>
        </div>
      </div>

      <div className="panel legal-content">
        <section className="legal-section">
          <h2>1. Overview and Scope</h2>
          <p>
            Rolevo is an application tracking workspace built for engineers, students, and job seekers to manage career search pipelines. This Privacy Policy details the specific data collected, how that data is stored, and the architectural safeguards in place to protect personal records.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. Information We Collect</h2>
          <p>
            Rolevo collects only the minimum information necessary to provide application tracking functionality:
          </p>
          <ul>
            <li>
              <strong>Account Data:</strong> Full name, email address, and a cryptographically salted and hashed password (processed using bcryptjs). Plaintext passwords are never stored or logged.
            </li>
            <li>
              <strong>Application Records:</strong> Target company names, job roles, salary expectations, application dates, interview schedules, job links, and optional interview preparation notes.
            </li>
            <li>
              <strong>Audit History:</strong> Timestamped lifecycle transitions (Applied, Interview, Offer, Rejected) logged within your application timeline.
            </li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>3. Data Isolation and Security Architecture</h2>
          <p>
            Rolevo enforces strict tenant isolation at the database layer. Every database operation executes with a mandatory user identifier filter derived directly from your verified JSON Web Token (JWT). Users cannot read, modify, or delete records belonging to any other user account.
          </p>
          <p>
            Client sessions are authenticated statelessly. JWT tokens are stored securely in browser localStorage and transmitted via encrypted HTTPS headers.
          </p>
        </section>

        <section className="legal-section">
          <h2>4. Third-Party Sharing and Tracking</h2>
          <p>
            Rolevo does not sell, license, rent, or trade your personal information, job applications, or company target lists to any third parties, advertisers, or recruitment agencies. We do not use third-party analytics trackers, tracking pixels, or cross-site behavioral cookies.
          </p>
        </section>

        <section className="legal-section">
          <h2>5. Data Retention and Deletion Rights</h2>
          <p>
            You retain complete ownership of your data. You may edit or permanently delete any job application directly from your dashboard at any time. When an application is deleted, all associated timeline records are permanently purged from the database.
          </p>
        </section>

        <section className="legal-section">
          <h2>6. Contact and Inquiries</h2>
          <p>
            For privacy inquiries or technical questions regarding data handling in Rolevo, contact the system administrator at <strong>narasimhatanmaikumar@gmail.com</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}

export default Privacy;
