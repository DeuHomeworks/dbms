const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const router = express.Router();

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Expecting "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    // Verify the token
    req.user = jwt.verify(token, process.env.JWT_SECRET); // Attach user info to the request
    console.log("Decoded User from Token:", req.user);

    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
// Get User Projects Route
// Get User Projects Route
router.get('/userProjects', authenticateUser, async (req, res) => {
  try {
    // Extract UID from req.user
    const userId = req.user.UID;
    console.log("User ID:", userId);

    if (!userId) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const query = `select * from projects where pmid =($1)`;
    const values = [userId];

    const result = await pool.query(query, values);
    console.log("Query Result:", result.rows);
    console.log("Query Values:", values);

    const projects = result.rows;

    if (projects.length === 0) {
      return res.status(404).json({ message: 'No projects found for this user' });
    }

    res.json(projects);
  } catch (err) {
    console.error('Error fetching user projects:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});



module.exports = router;