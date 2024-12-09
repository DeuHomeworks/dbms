const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const router = express.Router();

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Add more detailed logging
        console.log('Login attempt:', { email });

        const result = await pool.query('SELECT * FROM Users WHERE email = $1 AND password_hash = $2', [email, password]);
        const user = result.rows[0];

        if (!user) {
            console.log('User not found or invalid credentials:', email);
            return res.status(404).json({ message: 'User not found or invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ UID: user.uid }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;