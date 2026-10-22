import { needsFollowUp } from '../utils/helpers';
import { IconClock } from './Icons';

// Shows "Follow up" only when the application needs it (applied 7+ days ago without status progression)
function FollowUpLabel({ application }) {
  if (!needsFollowUp(application)) return null;
  return (
    <span className="followup" title="Applied over 7 days ago without response">
      <IconClock size={12} />
      <span>Follow up</span>
    </span>
  );
}

export default FollowUpLabel;
