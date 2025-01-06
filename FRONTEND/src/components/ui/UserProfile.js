import PropTypes from 'prop-types';

function UserProfile({ name, avatarUrl }) {
  return (
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 rounded-full overflow-hidden">
        <img
          src={avatarUrl}
          alt={`${name}'s avatar`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/40?text=U';
          }}
        />
      </div>
      <span className="font-medium text-gray-900">{name}</span>
    </div>
  );
}

UserProfile.propTypes = {
  name: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string.isRequired,
};

export default UserProfile;