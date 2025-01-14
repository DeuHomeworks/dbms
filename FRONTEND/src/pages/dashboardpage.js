import React, { useState, useEffect } from "react";
import { fetchUserDetails, authenticatedFetch } from '../utils/userUtils';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode library to decode JWT tokens
import "../styles/Dashboard.css";
import { fetchProjectTeams } from "../utils/dashboardUtils";

const Dashboard = () => {
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });
  const [teams, setTeams] = useState([]);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');
  // const decoded = jwtDecode(token); // Decode JWT to extract user info
  // const userId = decoded.UID; // Get the user ID from the decoded token

  useEffect(() => {
    if (token) {
      fetchUserDetails(token).then((userData) => {
        if (userData) {
          setUser(userData);
          console.log('User data:', userData);
        }

      });
    }
  }, []);

  // Fetch teams data
  useEffect(() => {
    const fetchTeams = async () => {
      if (!currentUser) return; // Only fetch teams if user is loaded

      try {
        const teamsData = await fetchProjectTeams(token);
        setTeams(teamsData);
      } catch (error) {
        console.error('Error fetching teams:', error);
        setError('Failed to load teams. Please try again later.');
      }
    };

    fetchTeams();
  });

  // Fetch tasks when a team is selected
  useEffect(() => {
    const fetchTasks = async () => {
      if (selectedTeam && selectedSection === 'tasks') {
        setIsLoading(true);
        try {
          const tasksData = await authenticatedFetch(`/api/teams/${selectedTeam.id}/tasks`);
          
          // Organize tasks by status
          const organizedTasks = {
            todo: tasksData.filter(task => task.status === 'todo'),
            inProgress: tasksData.filter(task => task.status === 'inProgress'),
            done: tasksData.filter(task => task.status === 'done')
          };
          
          setTasks(organizedTasks);
        } catch (error) {
          console.error('Error fetching tasks:', error);
          setError('Failed to load tasks. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchTasks();
  }, [selectedTeam, selectedSection]);

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

  // const handleDrop = async (e, targetColumn) => {
  //   e.preventDefault();
  //   const taskId = e.dataTransfer.getData("taskId");
  //   const sourceColumn = e.dataTransfer.getData("source");

  //   if (sourceColumn !== targetColumn) {
  //     try {
  //       await authenticatedFetch(`/api/tasks/${taskId}`, {
  //         method: 'PATCH',
  //         body: JSON.stringify({
  //           status: targetColumn
  //         })
  //       });

  //       // Update local state
  //       setTasks(prevTasks => {
  //         const task = prevTasks[sourceColumn].find(t => t.id === taskId);
  //         const updatedSource = prevTasks[sourceColumn].filter(t => t.id !== taskId);
  //         const updatedTarget = [...prevTasks[targetColumn], task];

  //         return {
  //           ...prevTasks,
  //           [sourceColumn]: updatedSource,
  //           [targetColumn]: updatedTarget,
  //         };
  //       });
  //     } catch (error) {
  //       console.error('Error updating task status:', error);
  //       setError('Failed to update task. Please try again.');
  //     }
  //   }
  // };

  const handleTeamClick = (team) => {
    if (userRole === "Manager" || team.members.includes(userRole)) {
      setSelectedTeam(team);
      setSelectedSection(null);
      setError(null); // Clear any previous errors
    }
  };

  const handleSectionClick = (section) => {
    setSelectedSection(section);
    setError(null); // Clear any previous errors
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
      return <p>Please select a section (Tasks, Notes, or Files) for {selectedTeam.name}.</p>;
    }

    return (
      <div className="kanban-board">
        {Object.keys(tasks).map((column) => (
          <div
            key={column}
            className={`kanban-column ${column}`}
            onDragOver={handleDragOver}
            // onDrop={(e) => handleDrop(e, column)}
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
        <div className="active-project">MBEA</div>
        <hr className="sidebar-divider" />

        <div className="sidebar-section">
          <h3>Teams</h3>
          <ul>
            {teams.map((team) => (
              <React.Fragment key={team.id}>
                <li
                  className={`team-item ${
                    userRole === "Manager" || team.members.includes(userRole)
                      ? "clickable"
                      : "disabled"
                  }`}
                  onClick={() => handleTeamClick(team)}
                >
                  {team.name}
                </li>

                {selectedTeam?.id === team.id && (
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