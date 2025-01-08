import PropTypes from 'prop-types';

function ProjectCard({ project }) {
  console.log('ProjectCard received project:', project);
  const { pname, pdesc } = project;

  return (
    <div className="relative bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      {/* Adding relative to make this card the reference point for absolute positioning */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{pname}</h3>
          {pdesc && (
            <p className="mt-1 text-sm text-gray-600">{pdesc}</p>
          )}
        </div>
        {/* Button positioned absolutely within the card */}
        <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-600 hover:text-primary-600 transition-colors">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

ProjectCard.propTypes = {
  project: PropTypes.shape({
    pid: PropTypes.number.isRequired,
    pmid: PropTypes.number,
    pname: PropTypes.string.isRequired,
    pdesc: PropTypes.string,
    pfolderid: PropTypes.string,
  }).isRequired
};

export default ProjectCard;
