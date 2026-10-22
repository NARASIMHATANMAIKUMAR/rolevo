import {
  IconBriefcase,
  IconSend,
  IconMessageSquare,
  IconCheckCircle,
  IconXCircle,
  IconTrendingUp,
} from './Icons';

// Row of statistical metric cards. "stats" comes from GET /api/applications/stats
function StatsCards({ stats }) {
  if (!stats) return null;

  const cards = [
    {
      label: 'Total Applications',
      value: stats.total ?? 0,
      classKey: 'stat-total',
      icon: <IconBriefcase size={16} />,
    },
    {
      label: 'Applied',
      value: stats.Applied ?? 0,
      classKey: 'stat-applied',
      icon: <IconSend size={16} />,
    },
    {
      label: 'Interviewing',
      value: stats.Interview ?? 0,
      classKey: 'stat-interview',
      icon: <IconMessageSquare size={16} />,
    },
    {
      label: 'Offers',
      value: stats.Offer ?? 0,
      classKey: 'stat-offer',
      icon: <IconCheckCircle size={16} />,
    },
    {
      label: 'Archived / Rejected',
      value: stats.Rejected ?? 0,
      classKey: 'stat-rejected',
      icon: <IconXCircle size={16} />,
    },
    {
      label: 'Response Rate',
      value: `${stats.responseRate ?? 0}%`,
      classKey: 'stat-rate',
      icon: <IconTrendingUp size={16} />,
      isRate: true,
      rateNum: stats.responseRate ?? 0,
    },
  ];

  return (
    <div className="stats" role="region" aria-label="Application statistics">
      {cards.map((card) => (
        <div className={`stat-card ${card.classKey}`} key={card.label}>
          <div className="stat-header">
            <span className="stat-label">{card.label}</span>
            <span className="stat-icon" aria-hidden="true">{card.icon}</span>
          </div>
          <div className="stat-value">{card.value}</div>
          {card.isRate && (
            <div className="stat-bar-track" aria-hidden="true">
              <div
                className="stat-bar-fill"
                style={{ width: `${Math.min(100, Math.max(0, card.rateNum))}%` }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default StatsCards;
