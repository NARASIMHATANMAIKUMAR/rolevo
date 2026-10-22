import { Link } from 'react-router-dom';
import { IconArrowLeft, IconFileText } from '../components/Icons';

function Terms() {
  return (
    <div className="legal-container">
      <div className="legal-header">
        <Link to="/" className="btn btn-secondary btn-small">
          <IconArrowLeft size={14} /> Back to Application
        </Link>
        <div className="legal-title-group">
          <div className="legal-badge">
            <IconFileText size={14} /> Terms and Conditions
          </div>
          <h1 className="legal-title">Terms and Conditions</h1>
          <p className="legal-meta">Effective Date: October 2026 | Version 1.0</p>
        </div>
      </div>

      <div className="panel legal-content">
        <section className="legal-section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By creating an account or accessing the Rolevo job application management platform, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, you should discontinue use of the platform.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. Authorized Purpose and Fair Use</h2>
          <p>
            Rolevo is provided to assist individuals with tracking, managing, and organizing their personal job applications, recruitment stages, and career search timelines. You agree to use the service solely for lawful personal and professional purposes.
          </p>
          <p>
            You agree not to attempt to compromise system security, circumvent authentication checks, overload API endpoints via automated scripts, or attempt unauthorized access to other accounts.
          </p>
        </section>

        <section className="legal-section">
          <h2>3. User Account Responsibilities</h2>
          <p>
            You are responsible for maintaining the confidentiality of your login credentials and for all activities conducted through your account. You agree to immediately notify the administrator if you suspect any unauthorized access to your account.
          </p>
        </section>

        <section className="legal-section">
          <h2>4. Data Accuracy and Exports</h2>
          <p>
            Rolevo provides in-browser CSV spreadsheet export tools for your convenience. You are encouraged to maintain regular offline backups of your job application records. Rolevo provides the software on an as-is basis without express warranty of uninterrupted uptime.
          </p>
        </section>

        <section className="legal-section">
          <h2>5. Modifications to the Service</h2>
          <p>
            We reserve the right to enhance, modify, or update features of Rolevo to improve security, usability, and performance. Continued use of the platform after updates constitutes acceptance of the modified terms.
          </p>
        </section>

        <section className="legal-section">
          <h2>6. Governing Contact</h2>
          <p>
            For questions regarding these Terms and Conditions, please contact <strong>narasimhatanmaikumar@gmail.com</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}

export default Terms;
