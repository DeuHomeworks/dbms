export async function fetchUserDetails(token) {
  try {
    const response = await fetch('http://localhost:5000/auth/user', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user details');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    return null;
  }
}

export async function authenticatedFetch(url, token) {}


// import React, { useState, useEffect } from "react";
// import { fetchProjectTeams } from "../utils/dashboardUtils";

// function ProjectTeamComponent() {
  // const [teams, setTeams] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //   const token = localStorage.getItem("token"); // Assume token is stored in localStorage

  //   // Fetch project teams data when component mounts
  //   async function getTeams() {
  //     const data = await fetchProjectTeams(token);
  //     if (data) {
  //       setTeams(data); // Store teams data in state
  //       console.log("Teams:", data);
  //     } else {
  //       setError("Failed to load team details");
  //     }
  //     setLoading(false);
  //   }

  //   getTeams();
  // }, []); // Empty dependency array to call once when the component mounts

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <div>
//       <h2>Project Teams</h2>
//       <ul>
//         {teams && Array.isArray(teams) && teams.length > 0 ? (
//           teams.map((team, index) => (
//             <li key={team.team_id}>{team.team_name}</li>
//           ))
//         ) : (
//           <li>No teams available</li>
//         )}
//       </ul>
//     </div>
//   );
// }

// export default ProjectTeamComponent;