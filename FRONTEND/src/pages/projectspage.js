import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/projectListLayout';
import UserProfile from '../components/ui/UserProfile';
import SearchBox from '../components/ui/SearchBox';
import ProjectList from '../components/projectsList/projectList';
import { fetchUserDetails } from '../utils/userUtils';
import logo from '../assets/logo2.png';
import CreateProjectButton from '../components/projectsList/CreateProjectButton';
import CreateProjectModal from '../components/modals/createProjectModal'; // Update this import

function ProjectsPage() {
  const [projects, setProjects] = useState([]); // Initialize projects state to an empty array
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Add this state

  const handleCreateProject = () => {
    setIsModalOpen(true); // Open the modal when the button is clicked
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  const handleSubmitProject = (projectData) => {
    // Add your project submission logic here
    console.log('Project submitted:', projectData);
    setIsModalOpen(false); // Close the modal after submission
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserDetails(token).then((userData) => {
        if (userData) {
          setUser(userData);
          fetchProjects(userData.id, token); // Fetch projects after setting user
        }
      });
    }
  }, []);

  const fetchProjects = async (userId, token) => {
    try {
      const response = await fetch('http://localhost:5000/projects/userProjects', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`, // Include token in Authorization header
          'User-ID': userId, // Include user ID in headers
        },
      });

      if (response.ok) {
        const projects = await response.json();
        setProjects(projects); // Update state with fetched projects
      } else {
        console.error('Failed to fetch projects');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center space-x-4 mb-8">
        {user ? (
          <UserProfile name={`${user.firstname} ${user.lastname}`} avatarUrl="/default-avatar.png" />
        ) : (
          <UserProfile name="Loading..." avatarUrl="/default-avatar.png" />
        )}
      </div>

      <div className="mb-8">
        <div className="flex justify-center -mb-2">
          <img src={logo} alt="Logo" className="w-48 h-48" />
        </div>
        <p className="text-center text-lg text-gray-600 -mt-10 mb-4">
          Nice to see you again! Here is your workspace.
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Your Projects</h2>
          <SearchBox />
        </div>
        <CreateProjectButton onClick={handleCreateProject}/>
        <ProjectList projects={projects} />
      </div>
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitProject}
      />
    </DashboardLayout>
  );
}

export default ProjectsPage;
