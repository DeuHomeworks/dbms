import PropTypes from 'prop-types';
import ProjectCard from '../ui/projectCard';

function ProjectList({ projects }) {
  if (!projects?.length) {
    return (
      <div className="text-center text-gray-500">
        No projects found. Start contributing to see them here!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

ProjectList.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      status: PropTypes.string,
      lastUpdated: PropTypes.string,
    })
  ).isRequired,
};

export default ProjectList;