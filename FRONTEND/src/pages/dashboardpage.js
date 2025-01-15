import React, { useState, useEffect } from "react";
import { fetchUserDetails } from '../utils/userUtils';
import { fetchProjectTeams, fetchTeamTasks } from "../utils/dashboardUtils";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [uploadStatus, setUploadStatus] = useState(""); // Track upload status
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });
  const [teams, setTeams] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const project = JSON.parse(localStorage.getItem("curProject"));
  console.log(project);
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
            console.log(tasksData);
            setTasks(organizedTasks);
            console.log("Organized Tasks",organizedTasks);
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
  const fileHandle = async (fileList, selectedTask) => {
    if (!selectedTask) {
      setUploadStatus("Please select a task before uploading a file.");
      return;
    }

    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      console.log("Selected file:", file.name);
      await uploadFileToBackend(file, selectedTask);
    } else {
      setUploadStatus("No file selected.");
    }
  };

  const handleDragStart = (e, task, sourceColumn) => {
    e.dataTransfer.setData("taskId", task.id);
    e.dataTransfer.setData("source", sourceColumn);
    e.currentTarget.style.opacity = "0.5";
  };

  const uploadFileToBackend = async (file, task) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("task", task); // Attach task to the form data
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await fetch("http://localhost:5000/cloud/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (response.ok) {
          setUploadStatus(`File uploaded successfully!`);
        } else {
          setUploadStatus("Error uploading file");
        }
      } catch (error) {
        console.error("Error during file upload to backend:", error);
        setUploadStatus("Error during file upload to backend");
      }
    } else {
      console.log("User is not logged in");
    }
  };

  const handleTaskSelection = (taskId) => {
    setSelectedTask(taskId);
    console.log(`Task selected: ${taskId}`);
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

    if (selectedSection === "files") {
      if (selectedSection === "files") {
        return (
            <div className="file-upload-section">
              <div className="task-selector">
                <label htmlFor="task-dropdown">Choose a task:</label>
                <select
                    id="task-dropdown"
                    defaultValue=""
                    onChange={(e) => handleTaskSelection(e.target.value)}
                >
                  <option value="" disabled>
                    Select a task
                  </option>
                  {Object.values(tasks).flat().map((task) => (
                      <option key={task.task_id} value={task.task_id}>
                        {task.task_name}
                      </option>
                  ))}
                </select>
              </div>

              <div className="file-uploader">
                <label htmlFor="file-input">Upload a file:</label>
                <input
                    id="file-input"
                    type="file"
                    onChange={(e) =>
                        fileHandle(e.target.files, document.getElementById("task-dropdown").value)
                    }
                />
              </div>
              {uploadStatus && <div className="upload-status">{uploadStatus}</div>}
            </div>
        );
      }

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
                          key={task.task_id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task, column)}
                          onDragEnd={handleDragEnd}
                      >
                        {task.task_name}
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
        <div className="active-project">{(project.project_name)}</div>
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