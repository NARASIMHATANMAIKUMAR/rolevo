import { Link } from 'react-router-dom';
import StatusSelect from './StatusSelect';
import FollowUpLabel from './FollowUpLabel';
import { IconStar, IconLocation, IconCalendar } from './Icons';
import { STATUSES, formatDate } from '../utils/helpers';

// 4-column visual Kanban board workflow with SVG icons and crisp status cards
function BoardView({ applications, onStatusChange, onToggleStar, updatingId }) {
  return (
    <div className="board" role="region" aria-label="Kanban pipeline board">
      {STATUSES.map((status) => {
        const items = applications.filter((app) => app.status === status);
        return (
          <section className={`board-col board-col-${status.toLowerCase()}`} key={status}>
            <div className="board-col-header">
              <div className="board-col-title-wrap">
                <span className="board-col-dot" aria-hidden="true" />
                <h2 className="board-col-title">{status}</h2>
              </div>
              <span className="board-count" aria-label={`${items.length} applications`}>
                {items.length}
              </span>
            </div>

            <div className="board-col-body">
              {items.length === 0 && (
                <div className="board-col-empty">
                  <span>No applications in {status}</span>
                </div>
              )}

              {items.map((app) => (
                <article className="card" key={app._id}>
                  <div className="card-header-row">
                    <Link to={`/applications/${app._id}`} className="card-title">
                      {app.company}
                    </Link>
                    <button
                      type="button"
                      className={`btn-star ${app.isStarred ? 'starred' : ''}`}
                      onClick={() => onToggleStar(app._id)}
                      title={app.isStarred ? 'Remove from priority targets' : 'Bookmark as priority target'}
                      aria-label={app.isStarred ? `Unstar ${app.company}` : `Star ${app.company}`}
                    >
                      <IconStar filled={Boolean(app.isStarred)} size={14} />
                    </button>
                  </div>

                  <div className="card-role">{app.role}</div>

                  <div className="card-tags-row">
                    {app.location && (
                      <span className="card-tag">
                        <IconLocation size={12} aria-hidden="true" />
                        <span>{app.location}</span>
                      </span>
                    )}
                    {app.salaryExpectation && (
                      <span className="salary-tag">{app.salaryExpectation}</span>
                    )}
                  </div>

                  <div className="card-meta">
                    <span className="card-date">
                      <IconCalendar size={12} aria-hidden="true" />
                      <span>Applied {formatDate(app.appliedDate)}</span>
                    </span>
                    {app.interviewDate && (
                      <span className="card-interview-date">
                        Interview: {formatDate(app.interviewDate)}
                      </span>
                    )}
                    <FollowUpLabel application={app} />
                  </div>

                  <div className="card-footer">
                    <label htmlFor={`status-${app._id}`} className="sr-only">Update Status</label>
                    <StatusSelect
                      id={`status-${app._id}`}
                      value={app.status}
                      disabled={updatingId === app._id}
                      onChange={(newStatus) => onStatusChange(app._id, newStatus)}
                    />
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default BoardView;
