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

// Signup Route
router.post('/signup', async (req, res) => {
  const { firstname, lastname, email, phone, password } = req.body;

  try {
    // Log the signup attempt
    console.log('Signup attempt:', { email });

    // // Hash the password
    // const saltRounds = 10;
    // const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user into the database
    const newUser = await pool.query(
      'INSERT INTO Users (firstname, lastname, email, phone, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [firstname, lastname, email, phone, password]
    );
    const user = newUser.rows[0];

    // Generate JWT token
    const token = jwt.sign({ UID: user.uid }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'User created successfully', token });
  } catch (err) {
    // Check for unique constraint violations
    if (err.code === '23505') {
      const field = err.constraint.includes('email') ? 'email' : 'phone';
      res.status(400).json({ message: `${field} is already in use` });
    } else {
      console.error('Signup error:', err);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  }
});

module.exports = router;


