const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const router = express.Router();

// Get User Projects Route
router.get('/userProjects', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const userId = req.headers['user-id'];

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'defaultsecretkey';
    jwt.verify(token, jwtSecret);

    const result = await pool.query(
      'SELECT * FROM Projects WHERE PMID = $1',
      [userId]
    );
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