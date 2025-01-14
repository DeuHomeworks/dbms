import React, { useState } from "react";
import "../styles/Dashboard.css";


const Dashboard = () => {
  const [tasks, setTasks] = useState({
    todo: ["Task 1", "Task 2", "Task 3"],
    inProgress: ["Task 4"],
    done: ["Task 5"],
  });
  const [userRole] = useState("Developer"); // Change to "Manager" or "Team Member" to test different roles
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);

  const handleDragStart = (e, task, sourceColumn) => {
    e.dataTransfer.setData("task", task);
    e.dataTransfer.setData("source", sourceColumn);

    // For visual feedback
    e.currentTarget.style.opacity = "0.5";
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = "1";
  };
  const handleDragOver = (e) => {
    e.preventDefault(); // Allow the drop operation
  };
  const handleDrop = (e, targetColumn) => {
    e.preventDefault(); // Prevent default behavior
    const task = e.dataTransfer.getData("task");
    const sourceColumn = e.dataTransfer.getData("source");

    if (sourceColumn !== targetColumn) {
      setTasks((prevTasks) => {
        const updatedSource = prevTasks[sourceColumn].filter((t) => t !== task);
        const updatedTarget = [...prevTasks[targetColumn], task];

        return {
          ...prevTasks,
          [sourceColumn]: updatedSource,
          [targetColumn]: updatedTarget,
        };
      });
    }
  };
  const handleTeamClick = (team) => {
    if (userRole === "Manager" || team.members.includes(userRole)) {
      setSelectedTeam(team);
      setSelectedSection(null); // Reset section when a new team is selected
    }
  };

  const handleSectionClick = (section) => {
    setSelectedSection(section);
  };

  const renderMainContent = () => {
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
                  onDrop={(e) => handleDrop(e, column)}
              >
                <h3>
                  {column === "todo"
                      ? "To Do"
                      : column === "inProgress"
                          ? "In Progress"
                          : "Done"}
                </h3>
                <ul>
                  {tasks[column].map((task, index) => (
                      <li
                          key={index}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task, column)}
                          onDragEnd={handleDragEnd}
                      >
                        {task}
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
        {/* Sidebar */}
        <div className="sidebar">
          {/* Active Project Name */}
          <div className="active-project">MBEA</div>
          <hr className="sidebar-divider"/>
          {/* Line added here */}

          <div className="sidebar-section">
            <h3>Teams</h3>
            <ul>
              {mockTeams.map((team) => (
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

                    {/* Submenu for selected team */}
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

          {/* Sidebar Footer */}
          <hr className="sidebar-divider" /> {/* Line above the footer */}
          <div className="sidebar-bottom">
            Logged in as Ahmed Yavuz
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">{renderMainContent()}</div>
      </div>
  );
};

export default Dashboard;
