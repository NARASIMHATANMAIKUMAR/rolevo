import { Link } from 'react-router-dom';
import StatusSelect from './StatusSelect';
import FollowUpLabel from './FollowUpLabel';
import { STATUSES, formatDate } from '../utils/helpers';

// 4 columns, one per status. Cards include Dream Star and Salary tag.
function BoardView({ applications, onStatusChange, onToggleStar, updatingId }) {
  return (
    <div className="board">
      {STATUSES.map((status) => {
        const items = applications.filter((app) => app.status === status);
        return (
          <section className={`board-col board-col-${status.toLowerCase()}`} key={status}>
            <div className="board-col-title">
              <span>{status}</span>
              <span className="muted">({items.length})</span>
            </div>

            {items.length === 0 && <p className="muted small">No applications</p>}

            {items.map((app) => (
              <div className="card" key={app._id}>
                <div className="card-header-row">
                  <Link to={`/applications/${app._id}`} className="card-title">
                    {app.company}
                  </Link>
                  <button
                    type="button"
                    className={`btn-icon ${app.isStarred ? 'starred' : ''}`}
                    onClick={() => onToggleStar(app._id)}
                    title={app.isStarred ? 'Starred as dream company' : 'Mark as dream company'}
                  >
                    {app.isStarred ? '⭐' : '☆'}
                  </button>
                </div>

                <div className="card-role">{app.role}</div>

                {app.salaryExpectation && (
                  <div>
                    <span className="salary-tag">{app.salaryExpectation}</span>
                  </div>
                )}

                <div className="card-meta">
                  <span>Applied {formatDate(app.appliedDate)}</span>
                  <FollowUpLabel application={app} />
                </div>

                <StatusSelect
                  value={app.status}
                  disabled={updatingId === app._id}
                  onChange={(newStatus) => onStatusChange(app._id, newStatus)}
                />
              </div>
            ))}
          </section>
        );
      })}
    </div>
  );
}

export default BoardView;
