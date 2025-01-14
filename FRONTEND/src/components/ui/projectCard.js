import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

function ProjectCard({ project }) {

  const navigate = useNavigate();

  const goToProject = () => {
    console.log('Go to project...', project);
    localStorage.setItem('curProject', project.project_id);

    navigate('/dashboard');
  }
  console.log('ProjectCard received project:', project);
  const { project_name, project_description } = project;

  return (
    <div className="relative bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow" onClick={goToProject}>
      {/* Adding relative to make this card the reference point for absolute positioning */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{project_name}</h3>
          {project_description && (
            <p className="mt-1 text-sm text-gray-600">{project_description}</p>
          )}
        </div>
        {/* Button positioned absolutely within the card */}
      </div>
    </div>
  );
}

ProjectCard.propTypes = {
  project: PropTypes.shape({
    project_id: PropTypes.number.isRequired,
    project_name: PropTypes.string.isRequired,
    project_description: PropTypes.string
  }).isRequired
};

export default ProjectCard;
