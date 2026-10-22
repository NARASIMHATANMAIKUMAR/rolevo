// Accessible status badge with subtle indicator dot
function StatusBadge({ status = 'Applied' }) {
  const safeStatus = status || 'Applied';
  return (
    <span className={`badge badge-${safeStatus.toLowerCase()}`}>
      <span className="badge-dot" aria-hidden="true" />
      <span>{safeStatus}</span>
    </span>
  );
}

export default StatusBadge;
