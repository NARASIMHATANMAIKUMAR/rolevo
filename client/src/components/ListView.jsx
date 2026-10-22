import { Link } from 'react-router-dom';
import StatusSelect from './StatusSelect';
import FollowUpLabel from './FollowUpLabel';
import { IconStar } from './Icons';
import { formatDate } from '../utils/helpers';

// Tabular spreadsheet view of applications with Star bookmark toggle and status selection
function ListView({ applications, onStatusChange, onToggleStar, updatingId }) {
  return (
    <div className="table-wrap" tabIndex="0" role="region" aria-label="Job applications table">
      <table className="table">
        <thead>
          <tr>
            <th className="col-star" title="Priority Bookmark">
              <span className="sr-only">Priority</span>
              <IconStar size={14} aria-hidden="true" />
            </th>
            <th>Company</th>
            <th>Role</th>
            <th>Location</th>
            <th>Salary / CTC</th>
            <th>Applied Date</th>
            <th>Interview Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app._id}>
              <td className="col-star">
                <button
                  type="button"
                  className={`btn-star ${app.isStarred ? 'starred' : ''}`}
                  onClick={() => onToggleStar(app._id)}
                  title={app.isStarred ? 'Remove from priority bookmarks' : 'Bookmark as priority target'}
                  aria-label={app.isStarred ? `Unstar ${app.company}` : `Star ${app.company}`}
                >
                  <IconStar filled={Boolean(app.isStarred)} size={15} />
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
              <td className="cell-role">{app.role}</td>
              <td className="cell-location">{app.location || '-'}</td>
              <td>
                {app.salaryExpectation ? (
                  <span className="salary-tag">{app.salaryExpectation}</span>
                ) : (
                  <span className="muted">-</span>
                )}
              </td>
              <td className="nowrap cell-date">{formatDate(app.appliedDate)}</td>
              <td className="nowrap cell-date">{formatDate(app.interviewDate) || '-'}</td>
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
