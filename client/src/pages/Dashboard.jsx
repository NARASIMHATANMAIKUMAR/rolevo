import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../api/axios';
import StatsCards from '../components/StatsCards';
import ListView from '../components/ListView';
import BoardView from '../components/BoardView';
import { STATUSES } from '../utils/helpers';

// Remember which view (list/board) the user picked last time
function getSavedView() {
  return localStorage.getItem('view') === 'board' ? 'board' : 'list';
}

function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [stats, setStats] = useState(null);
  const [statsError, setStatsError] = useState('');

  // Filters - sent to the backend as query params
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sort, setSort] = useState('newest');
  const [starredOnly, setStarredOnly] = useState(false);

  const [view, setView] = useState(getSavedView);
  const [updatingId, setUpdatingId] = useState(null); // id of the row whose status is being saved

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

  // Load stats once when the page opens
  useEffect(() => {
    loadStats();
  }, []);

  // Load applications whenever a filter changes.
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

  // Called by the status dropdown in ListView / BoardView
  async function handleStatusChange(id, status) {
    setUpdatingId(id);
    setError('');
    try {
      const res = await api.patch(`/applications/${id}/status`, { status });
      setApplications((prev) => prev.map((app) => (app._id === id ? res.data : app)));
      loadStats();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUpdatingId(null);
    }
  }

  // Toggle Star / Dream company bookmark
  async function handleToggleStar(id) {
    try {
      const res = await api.patch(`/applications/${id}/star`);
      setApplications((prev) =>
        prev.map((app) => (app._id === id ? { ...app, isStarred: res.data.isStarred } : app))
      );
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  // Export current applications list as a CSV file
  function handleExportCSV() {
    if (applications.length === 0) {
      alert('No applications to export.');
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
      'Dream Company (Starred)',
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
  }

  const hasFilters = search !== '' || statusFilter !== '' || starredOnly;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span>Job Applications</span>
          </h1>
          <p className="muted small" style={{ margin: '4px 0 0' }}>
            Track and progress your job hunt in one organized space
          </p>
        </div>
        <div className="actions">
          <button
            type="button"
            className="btn btn-export"
            onClick={handleExportCSV}
            title="Download CSV spreadsheet report"
          >
            <span>📥</span> Export CSV
          </button>
          <Link to="/applications/new" className="btn btn-primary">
            <span>+</span> New Application
          </Link>
        </div>
      </div>

      {statsError && <div className="alert">{statsError}</div>}
      {stats ? <StatsCards stats={stats} /> : !statsError && <p className="muted">Loading stats...</p>}

      <div className="toolbar panel">
        <input
          type="search"
          placeholder="Search by company or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Applied: newest first</option>
          <option value="oldest">Applied: oldest first</option>
        </select>

        <button
          type="button"
          className={`btn-filter-star ${starredOnly ? 'active' : ''}`}
          onClick={() => setStarredOnly(!starredOnly)}
          title="Toggle starred / dream companies"
        >
          <span>{starredOnly ? '⭐' : '☆'}</span>
          <span>{starredOnly ? 'Starred Only' : 'Favorites'}</span>
        </button>

        <div className="view-toggle">
          <button className={view === 'list' ? 'active' : ''} onClick={() => changeView('list')}>
            List View
          </button>
          <button className={view === 'board' ? 'active' : ''} onClick={() => changeView('board')}>
            Board View
          </button>
        </div>
      </div>

      {error && <div className="alert">{error}</div>}

      {loading ? (
        <p className="muted">Loading applications...</p>
      ) : applications.length === 0 ? (
        <div className="panel empty">
          {hasFilters
            ? 'No applications match your active search or filters.'
            : 'No applications yet. Click "+ New Application" to add your first job!'}
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
