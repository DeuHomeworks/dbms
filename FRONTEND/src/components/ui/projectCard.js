import PropTypes from 'prop-types';
import { formatDate } from '../../utils/dateUtils';
import StatusBadge from '../ui/StatusBadge';

function ProjectCard({ project }) {
  const { name, description, status, lastUpdated } = project;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          {description && (
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          )}
        </div>
        <StatusBadge status={status} />
      </div>
      <div className="mt-4 text-xs text-gray-500">
        Last updated: {formatDate(lastUpdated)}
      </div>
    </div>
  );
}

ProjectCard.propTypes = {
  project: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    status: PropTypes.oneOf(['active', 'pending', 'completed', 'archived']).isRequired,
    lastUpdated: PropTypes.string.isRequired,
  }).isRequired,
};

export default ProjectCard;