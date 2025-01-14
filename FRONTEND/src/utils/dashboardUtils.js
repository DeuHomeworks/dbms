export async function fetchProjectTeams(token) {
  const curProject = localStorage.getItem("curProject");
  try {
    const response = await fetch("http://localhost:5000/dashboard/getTeams", {
      method: "POST", // Keep as POST
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ curProject: curProject }), // Pass curProject in the body
    });
    if (!response.ok) {
      throw new Error("Failed to fetch team details");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching team details:", error);
    return null;
  }
}

export async function fetchTeamTasks(token, teamID) {
  try {
    const response = await fetch("http://localhost:5000/dashboard/getTasks", {
      method: "POST", // Change to POST
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({teamid: teamID}), // Include curProject in the body
    });
    if (!response.ok) {
      throw new Error("Failed to fetch team's task details");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching team's task details:", error);
    return null;
  }
}
