import PropTypes from 'prop-types';
import ProjectCard from '../ui/projectCard';

function ProjectList({ projects }) {
  console.log('ProjectList received projects:', projects);

  if (!projects?.length) {
    console.log('No projects found - rendering empty state');
    return (
      <div className="text-center text-gray-500">
        No projects found. Start contributing to see them here!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <ProjectCard 
          key={project.project_id}  // Changed from id to pid
          project={project} 
        />
      ))}
    </div>
  );
}

ProjectList.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      project_id: PropTypes.number.isRequired,
      project_name: PropTypes.string.isRequired,
      project_description: PropTypes.string
    })
  ).isRequired,
};

export default ProjectList;