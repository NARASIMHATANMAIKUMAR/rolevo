import { Link } from 'react-router-dom';
import StatusSelect from './StatusSelect';
import FollowUpLabel from './FollowUpLabel';
import { formatDate } from '../utils/helpers';

// Spreadsheet-like table of applications with Dream Star and salary badge
function ListView({ applications, onStatusChange, onToggleStar, updatingId }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th className="col-star" title="Dream Company Bookmark">★</th>
            <th>Company</th>
            <th>Role</th>
            <th>Location</th>
            <th>Salary / CTC</th>
            <th>Applied</th>
            <th>Interview</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app._id}>
              <td className="col-star">
                <button
                  type="button"
                  className={`btn-icon ${app.isStarred ? 'starred' : ''}`}
                  onClick={() => onToggleStar(app._id)}
                  title={app.isStarred ? 'Starred as dream company' : 'Mark as dream company'}
                >
                  {app.isStarred ? '⭐' : '☆'}
                </button>
              </td>
              <td>
                <div className="company-cell">
                  <Link to={`/applications/${app._id}`} className="company-name">
                    {app.company}
                  </Link>
                  <FollowUpLabel application={app} />
                </div>
              </td>
              <td>{app.role}</td>
              <td>{app.location || '-'}</td>
              <td>
                {app.salaryExpectation ? (
                  <span className="salary-tag">{app.salaryExpectation}</span>
                ) : (
                  <span className="muted">-</span>
                )}
              </td>
              <td className="nowrap">{formatDate(app.appliedDate)}</td>
              <td className="nowrap">{formatDate(app.interviewDate)}</td>
              <td>
                <StatusSelect
                  value={app.status}
                  disabled={updatingId === app._id}
                  onChange={(status) => onStatusChange(app._id, status)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListView;
