import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../api/axios';
import StatsCards from '../components/StatsCards';
import ListView from '../components/ListView';
import BoardView from '../components/BoardView';
import {
  IconSearch,
  IconDownload,
  IconPlus,
  IconStar,
  IconList,
  IconKanban,
  IconBriefcase,
  IconFilter
} from '../components/Icons';
import { STATUSES } from '../utils/helpers';

// Remember which view (list/board) the user picked last time
function getSavedView() {
  return localStorage.getItem('view') === 'board' ? 'board' : 'list';
}

function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const [stats, setStats] = useState(null);
  const [statsError, setStatsError] = useState('');

  // Filters: sent to backend as query parameters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sort, setSort] = useState('newest');
  const [starredOnly, setStarredOnly] = useState(false);

  const [view, setView] = useState(getSavedView);
  const [updatingId, setUpdatingId] = useState(null);

  function showToast(msg) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  }

  // Load stats cards
  async function loadStats() {
    try {
      const res = await api.get('/applications/stats');
      setStats(res.data);
      setStatsError('');
    } catch (err) {
      setStatsError(getErrorMessage(err));
    }
  }

  // Load stats once on mount
  useEffect(() => {
    loadStats();
  }, []);

  // Load applications whenever a filter changes
  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/applications', {
          params: {
            search,
            status: statusFilter,
            sort,
            starred: starredOnly ? 'true' : undefined,
          },
        });
        setApplications(res.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, statusFilter, sort, starredOnly]);

  function changeView(newView) {
    setView(newView);
    localStorage.setItem('view', newView);
  }

  // Called by status selector in ListView / BoardView
  async function handleStatusChange(id, status) {
    setUpdatingId(id);
    setError('');
    try {
      const res = await api.patch(`/applications/${id}/status`, { status });
      setApplications((prev) => prev.map((app) => (app._id === id ? res.data : app)));
      loadStats();
      showToast(`Status updated to "${status}"`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUpdatingId(null);
    }
  }

  // Toggle Star / Priority bookmark
  async function handleToggleStar(id) {
    try {
      const res = await api.patch(`/applications/${id}/star`);
      setApplications((prev) =>
        prev.map((app) => (app._id === id ? { ...app, isStarred: res.data.isStarred } : app))
      );
      showToast(res.data.isStarred ? 'Marked as priority target' : 'Removed from priority targets');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  // Export current applications list as an RFC 4180 CSV file
  function handleExportCSV() {
    if (applications.length === 0) {
      setError('No applications available to export.');
      return;
    }

    const headers = [
      'Company',
      'Role',
      'Status',
      'Applied Date',
      'Interview Date',
      'Location',
      'Salary Expectation',
      'Priority Bookmark',
      'Notes',
      'Job Link',
    ];

    const rows = applications.map((app) => [
      `"${(app.company || '').replace(/"/g, '""')}"`,
      `"${(app.role || '').replace(/"/g, '""')}"`,
      `"${app.status || ''}"`,
      `"${app.appliedDate ? new Date(app.appliedDate).toISOString().split('T')[0] : ''}"`,
      `"${app.interviewDate ? new Date(app.interviewDate).toISOString().split('T')[0] : ''}"`,
      `"${(app.location || '').replace(/"/g, '""')}"`,
      `"${(app.salaryExpectation || '').replace(/"/g, '""')}"`,
      `"${app.isStarred ? 'Yes' : 'No'}"`,
      `"${(app.notes || '').replace(/"/g, '""')}"`,
      `"${(app.jobLink || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodedUri);
    downloadAnchor.setAttribute(
      'download',
      `Rolevo_Applications_Report_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    showToast('Spreadsheet report exported successfully');
  }

  const hasFilters = search !== '' || statusFilter !== '' || starredOnly;

  return (
    <div className="dashboard-wrap">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span>Job Applications</span>
          </h1>
          <p className="page-subtitle">
            Manage your application pipeline, interview milestones, and offer status
          </p>
        </div>
        <div className="actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleExportCSV}
            title="Download CSV spreadsheet report"
          >
            <IconDownload size={15} /> Export CSV
          </button>
          <Link to="/applications/new" className="btn btn-primary">
            <IconPlus size={15} /> New Application
          </Link>
        </div>
      </div>

      {toastMessage && (
        <div className="toast-notification" role="status" aria-live="polite">
          <span>{toastMessage}</span>
        </div>
      )}

      {statsError && <div className="alert">{statsError}</div>}
      {stats ? (
        <StatsCards stats={stats} />
      ) : !statsError ? (
        <div className="stats-loading-skeleton" aria-hidden="true" />
      ) : null}

      <div className="toolbar panel">
        <div className="search-input-wrap">
          <IconSearch size={15} className="search-icon" />
          <input
            type="search"
            aria-label="Search by company or role"
            placeholder="Search company or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="toolbar-controls">
          <div className="select-wrap">
            <select
              aria-label="Filter by application status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="select-wrap">
            <select
              aria-label="Sort applications"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">Applied: newest first</option>
              <option value="oldest">Applied: oldest first</option>
            </select>
          </div>

          <button
            type="button"
            className={`btn-filter-star ${starredOnly ? 'active' : ''}`}
            onClick={() => setStarredOnly(!starredOnly)}
            title="Filter by priority targets"
            aria-pressed={starredOnly}
          >
            <IconStar filled={starredOnly} size={14} />
            <span>{starredOnly ? 'Priority Only' : 'Priority Targets'}</span>
          </button>

          <div className="view-toggle" role="group" aria-label="Layout view">
            <button
              type="button"
              className={view === 'list' ? 'active' : ''}
              onClick={() => changeView('list')}
              title="Table row layout"
              aria-pressed={view === 'list'}
            >
              <IconList size={14} />
              <span>List</span>
            </button>
            <button
              type="button"
              className={view === 'board' ? 'active' : ''}
              onClick={() => changeView('board')}
              title="Kanban column layout"
              aria-pressed={view === 'board'}
            >
              <IconKanban size={14} />
              <span>Board</span>
            </button>
          </div>
        </div>
      </div>

      {error && <div className="alert">{error}</div>}

      {loading ? (
        <div className="panel loading-state">
          <p className="muted">Updating application records...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="panel empty-state" role="region" aria-label="Empty applications state">
          <div className="empty-state-icon" aria-hidden="true">
            <IconBriefcase size={36} />
          </div>
          <h2 className="empty-state-title">
            {hasFilters ? 'No matching applications found' : 'No applications logged yet'}
          </h2>
          <p className="empty-state-text">
            {hasFilters
              ? 'Try modifying your search criteria or reset filters to display all records.'
              : 'Add your first job application to initiate your pipeline tracking.'}
          </p>
          {hasFilters ? (
            <button
              type="button"
              className="btn btn-secondary btn-small"
              onClick={() => {
                setSearch('');
                setStatusFilter('');
                setStarredOnly(false);
              }}
            >
              Reset Filters
            </button>
          ) : (
            <Link to="/applications/new" className="btn btn-primary btn-small">
              <IconPlus size={14} /> Add First Application
            </Link>
          )}
        </div>
      ) : view === 'list' ? (
        <ListView
          applications={applications}
          onStatusChange={handleStatusChange}
          onToggleStar={handleToggleStar}
          updatingId={updatingId}
        />
      ) : (
        <BoardView
          applications={applications}
          onStatusChange={handleStatusChange}
          onToggleStar={handleToggleStar}
          updatingId={updatingId}
        />
      )}
    </div>
  );
}

export default Dashboard;
