import PropTypes from 'prop-types';

const statusStyles = {
  active: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-blue-100 text-blue-800',
  archived: 'bg-gray-100 text-gray-800',
};

function StatusBadge({ status }) {
  const baseStyles = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';
  
  // Use a fallback value if `status` is null or undefined
  const safeStatus = status ? status.toLowerCase() : 'active';
  const colorStyles = statusStyles[safeStatus] || statusStyles.active;

  return (
    <span className={`${baseStyles} ${colorStyles}`}>
      {status || 'Active'} {/* Fallback to 'Active' */}
    </span>
  );
}

StatusBadge.propTypes = {
  status: PropTypes.string,
};

StatusBadge.defaultProps = {
  status: 'Active', // Default status if none is provided
};

export default StatusBadge;
