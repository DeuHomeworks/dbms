import PropTypes from 'prop-types';

function ProjectListLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-100 to-primary-200">
      <div className="absolute inset-0 backdrop-blur-sm" />
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-xl p-8">
          {children}
        </div>
      </div>
    </div>
  );
}

ProjectListLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProjectListLayout;