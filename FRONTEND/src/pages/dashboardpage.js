import React, { useState, useEffect } from "react";
import { fetchUserDetails } from '../utils/userUtils';
import { fetchProjectTeams, fetchTeamTasks } from "../utils/dashboardUtils";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });
  const [teams, setTeams] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  // Fetch user details
  useEffect(() => {
    const getUserDetails = async () => {
      if (token) {
        try {
          const userData = await fetchUserDetails(token);
          if (userData) {
            setCurrentUser(userData);
            console.log('User data:', userData);
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
          setError('Failed to load user details');
        }
      }
    };
    getUserDetails();
  }, [token]);

  // Fetch teams data
  useEffect(() => {
    const fetchTeams = async () => {
      if (!currentUser) return;

      try {
        const teamsData = await fetchProjectTeams(token);
        if (teamsData) {
          setTeams(teamsData);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
        setError('Failed to load teams. Please try again later.');
      }
    };

    fetchTeams();
  }, [currentUser, token]);

  // Fetch tasks when a team is selected
  useEffect(() => {
    const fetchTasks = async () => {
      if (selectedTeam && selectedSection === 'tasks') {
        setIsLoading(true);
        try {
          const tasksData = await fetchTeamTasks(token, selectedTeam.team_id);
          
          if (tasksData) {
            // Organize tasks by status
            const organizedTasks = {
              todo: tasksData.filter(task => task.status === 'todo'),
              inProgress: tasksData.filter(task => task.status === 'inProgress'),
              done: tasksData.filter(task => task.status === 'done')
            };
            
            setTasks(organizedTasks);
          }
        } catch (error) {
          console.error('Error fetching tasks:', error);
          setError('Failed to load tasks. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchTasks();
  }, [selectedTeam, selectedSection, token]);

  const handleDragStart = (e, task, sourceColumn) => {
    e.dataTransfer.setData("taskId", task.id);
    e.dataTransfer.setData("source", sourceColumn);
    e.currentTarget.style.opacity = "0.5";
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = "1";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleTeamClick = (team) => {
    // Modified to check if user is manager in the current project
    const curProject = localStorage.getItem("curProject");
    const userProjects = JSON.parse(localStorage.getItem("userProjects") || "[]");
    const currentProject = userProjects.find(p => p.project_id.toString() === curProject);
    
    if (currentProject?.is_manager || true) { // Temporarily allowing all users to access teams
      setSelectedTeam(team);
      setSelectedSection(null);
      setError(null);
    }
  };

  const handleSectionClick = (section) => {
    setSelectedSection(section);
    setError(null);
  };

  const renderMainContent = () => {
    if (isLoading) {
      return <div className="loading">Loading...</div>;
    }

    if (error) {
      return <div className="error-message">{error}</div>;
    }

    if (!selectedTeam) {
      return <p>Please select a team to see its details.</p>;
    }

    if (!selectedSection) {
      return <p>Please select a section (Tasks, Notes, or Files) for {selectedTeam.team_name}</p>;
    }

    return (
      <div className="kanban-board">
        {Object.keys(tasks).map((column) => (
          <div
            key={column}
            className={`kanban-column ${column}`}
            onDragOver={handleDragOver}
          >
            <h3>
              {column === "todo"
                ? "To Do"
                : column === "inProgress"
                ? "In Progress"
                : "Done"}
            </h3>
            <ul>
              {tasks[column].map((task) => (
                <li
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task, column)}
                  onDragEnd={handleDragEnd}
                >
                  {task.title}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="active-project">{localStorage.getItem("curProject") || "No Project Selected"}</div>
        <hr className="sidebar-divider" />

        <div className="sidebar-section">
          <h3>Teams</h3>
          <ul>
            {teams.map((team) => (
              <React.Fragment key={team.team_id}>
                <li
                  className="team-item clickable"
                  onClick={() => handleTeamClick(team)}
                >
                  {team.team_name}
                </li>

                {selectedTeam?.team_id === team.team_id && (
                  <ul className="team-submenu">
                    <li
                      className={`submenu-item ${
                        selectedSection === "tasks" ? "active" : ""
                      }`}
                      onClick={() => handleSectionClick("tasks")}
                    >
                      Tasks
                    </li>
                    <li
                      className={`submenu-item ${
                        selectedSection === "notes" ? "active" : ""
                      }`}
                      onClick={() => handleSectionClick("notes")}
                    >
                      Notes
                    </li>
                    <li
                      className={`submenu-item ${
                        selectedSection === "files" ? "active" : ""
                      }`}
                      onClick={() => handleSectionClick("files")}
                    >
                      Files
                    </li>
                  </ul>
                )}
              </React.Fragment>
            ))}
          </ul>
        </div>

        <hr className="sidebar-divider" />
        <div className="sidebar-bottom">
          {currentUser ? `Logged in as ${currentUser.firstname} ${currentUser.lastname}` : 'Loading...'}
        </div>
      </div>

      <div className="main-content">{renderMainContent()}</div>
    </div>
  );
};

export default Dashboard;