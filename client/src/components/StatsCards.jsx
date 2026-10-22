// Row of number cards at the top of the dashboard. "stats" comes from GET /api/applications/stats
function StatsCards({ stats }) {
  const cards = [
    { label: 'Total', value: stats.total, classKey: 'stat-total', icon: '📁' },
    { label: 'Applied', value: stats.Applied, classKey: 'stat-applied', icon: '✉️' },
    { label: 'Interview', value: stats.Interview, classKey: 'stat-interview', icon: '🎯' },
    { label: 'Offer', value: stats.Offer, classKey: 'stat-offer', icon: '🏆' },
    { label: 'Rejected', value: stats.Rejected, classKey: 'stat-rejected', icon: '🛑' },
    {
      label: 'Response rate',
      value: `${stats.responseRate}%`,
      classKey: 'stat-rate',
      icon: '📈',
      isRate: true,
      rateNum: stats.responseRate,
    },
  ];

  return (
    <div className="stats">
      {cards.map((card) => (
        <div className={`stat-card ${card.classKey}`} key={card.label}>
          <div className="stat-header">
            <span className="stat-label">{card.label}</span>
            <span className="stat-icon">{card.icon}</span>
          </div>
          <div className="stat-value">{card.value}</div>
          {card.isRate && (
            <div className="stat-bar-track">
              <div
                className="stat-bar-fill"
                style={{ width: `${Math.min(100, Math.max(0, card.rateNum || 0))}%` }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default StatsCards;
