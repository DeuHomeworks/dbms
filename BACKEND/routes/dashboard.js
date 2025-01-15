const express = require('express');
const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const router = express.Router();


router.post('/getTeams', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const project = JSON.parse(req.body.curProject);  // No need to JSON.parse()

    if (!token) {
        return res.status(401).json({ message: "Authentication required" });
    }

    if (!project) {
        return res.status(400).json({ error: 'Project ID (curProject) is required.' });
    }

    try {
        const jwtSecret = process.env.JWT_SECRET || 'defaultsecretkey';
        jwt.verify(token, jwtSecret);

        const result = await pool.query(
            'SELECT * FROM get_teams_under_project($1);',
            [project.project_id]
        );
        const teams = result.rows;
        console.log('Projects Teams:', teams);

        if (teams.length === 0) {
            return res.status(404).json({ message: 'No projects found for this user' });
        }

        res.json(teams);
    } catch (err) {
        console.error('Error fetching user projects:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});





router.post('/getTasks', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const teamId = JSON.parse(req.body.teamId); // Properly destructuring curProject from req.body

    if (!token) {
        return res.status(401).json({ message: "Authentication required" });
    }

    if (!teamId) {
        return res.status(400).json({ error: 'TeamId Needed.' });
    }

    try {
        const jwtSecret = process.env.JWT_SECRET || 'defaultsecretkey';
        jwt.verify(token, jwtSecret);

        const result = await pool.query(
            'SELECT * FROM get_team_tasks($1);',
            [teamId]
        );
        const tasks = result.rows;
        console.log('Teams Tasks:', tasks);

        if (tasks.length === 0) {
            return res.status(404).json({ message: 'No projects found for this user' });
        }

        res.json(tasks);
    } catch (err) {
        console.error('Error fetching user projects:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});



module.exports = router;