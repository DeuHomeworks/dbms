export async function fetchProjectTeams(token) {
  const curProject = localStorage.getItem("curProject");
  try {
    const response = await fetch("http://localhost:5000/dashboard/getTeams", {
      method: "POST", // Keep as POST
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ curProject: curProject }), // Stringify curProject
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
    console.log("fetchTeamTasks Teamıd: ",teamID);
    console.log("fetchTeamTasks Token: ",token);

    const response = await fetch("http://localhost:5000/dashboard/getTasks", {
      method: "POST", // Change to POST
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ teamId: teamID }), // Stringify curProject
    });
    if (!response.ok) {
      throw new Error("Failed to fetch team's task details");
    }
    const data = await response.json();
    console.log("Teams Taks:",data);
    return data;
  } catch (error) {
    console.error("Error fetching team's task details:", error);
    return null;
  }
}
