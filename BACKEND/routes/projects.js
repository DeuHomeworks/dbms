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
      'SELECT * FROM getuserprojects($1);',
      [userId]
    );
    const projects = result.rows;
    console.log('User projects:', projects);

    if (projects.length === 0) {
      return res.status(404).json({ message: 'No projects found for this user' });
    }

    res.json(projects);
  } catch (err) {
    console.error('Error fetching user projects:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/currProjectDetails', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const userId = req.headers['user-id'];

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'defaultsecretkey';
    jwt.verify(token, jwtSecret);

    const result = await pool.query(
        'SELECT * FROM getCurrProjectDetails($1,$2);',
        [userId],[]
    );
    const projects = result.rows;
    console.log('User projects:', projects);

    if (projects.length === 0) {
      return res.status(404).json({ message: 'No projects found for this user' });
    }

    res.json(projects);
  } catch (err) {
    console.error('Error fetching user projects:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create Project Route
router.post('/createProject', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  const userId = req.headers['user-id'];

  console.log('Received request:', {
    body: req.body,
    userId,
    token: token ? 'Token present' : 'Token missing'
  });

  if (!token || !userId) {
    return res.status(401).json({ 
      message: `Authentication required token:${token} user-id:${userId}` 
    });
  }

  const { name, description, teams } = req.body;
  
  // Validate required fields
  if (!name || !teams || !teams.length) {
    return res.status(400).json({
      message: 'Missing required fields: name and teams are required'
    });
  }

  const client = await pool.connect();

  try {
    const jwtSecret = process.env.JWT_SECRET || 'defaultsecretkey';
    jwt.verify(token, jwtSecret);

    await client.query('BEGIN');

    // Log each database operation
    console.log('Creating project for:', { userId, name, description });

    const projectResult = await client.query(
      'INSERT INTO Projects (PMID, pname, pdesc) VALUES ($1, $2, $3) RETURNING PID;',
      [userId, name, description]
    );

    const projectId = projectResult.rows[0].pid;
    console.log('Created project with ID:', projectId);

    // Process teams with more detailed logging
    for (const team of teams) {
      console.log('Processing team:', team);

      try {
        const teamResult = await client.query(
          'INSERT INTO Teams (TMID, tname) VALUES ($1, $2) RETURNING TID;',
          [team.captain.id || userId, team.name]
        );
        const teamId = teamResult.rows[0].tid;

        console.log('Created team with ID:', teamId);

        await client.query(
          'INSERT INTO ProjectTeams (PID, TID) VALUES ($1, $2);',
          [projectId, teamId]
        );

        // Add team captain
        await client.query(
          'INSERT INTO TeamMembers (TID, UID) VALUES ($1, $2);',
          [teamId, team.captain.id || userId]
        );

        // Process team members
        for (const member of team.members) {
          console.log('Processing team member:', member);
          
          const userResult = await client.query(
            'SELECT UID FROM Users WHERE email = $1;',
            [member.email]
          );

          if (userResult.rows.length > 0) {
            const memberId = userResult.rows[0].uid;
            await client.query(
              'INSERT INTO TeamMembers (TID, UID) VALUES ($1, $2);',
              [teamId, memberId]
            );
          } else {
            console.log('User not found for email:', member.email);
          }
        }
      } catch (teamError) {
        console.error('Error processing team:', {
          team,
          error: teamError.message
        });
        throw teamError;
      }
    }

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Project created successfully',
      projectId: projectId
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Detailed error:', {
      message: err.message,
      stack: err.stack,
      query: err.query
    });
    res.status(500).json({ 
      message: 'Server error', 
      error: err.message,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  } finally {
    client.release();
  }
});




module.exports = router;