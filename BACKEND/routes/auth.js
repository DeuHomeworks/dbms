const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const bcrypt = require('bcrypt');
const router = express.Router();

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        // Add more detailed logging
        console.log('Login attempt:', { email });

        const result = await pool.query('SELECT * FROM Users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            console.log('User not found or incorrect password', email);
            return res.status(404).json({ message: 'User not found or incorrect password' });
        }
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            console.log('User not found or incorrect password.', email);
            return res.status(401).json({ message: 'User not found or incorrect password' });
        }
        const jwtSecret = process.env.JWT_SECRET || 'defaultsecretkey';
        if (!jwtSecret) {
            console.error('JWT_SECRET is not defined');
            return res.status(500).json({ message: 'Server configuration error' });
        }
        // Generate JWT token
        const token = jwt.sign({ UID: user.uid }, jwtSecret, { expiresIn: '1h' });

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
      if (!email || !password) {
          return res.status(400).json({ message: 'Email and password are required' });
      }
    // Log the signup attempt
    console.log('Signup attempt:', { email });

    // // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user into the database
    const newUser = await pool.query(
      'INSERT INTO Users (firstname, lastname, email, phone, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [firstname, lastname, email, phone, hashedPassword]
    );
    const user = newUser.rows[0];
    const jwtSecret = process.env.JWT_SECRET || 'defaultsecretkey';
    if (!jwtSecret) {
        console.error('JWT_SECRET is not defined');
        return res.status(500).json({ message: 'Server configuration error' });
    }
    // Generate JWT token
    const token = jwt.sign({ UID: user.uid }, jwtSecret , { expiresIn: '1h' });

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


// Get User Details Route
router.get('/user', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'defaultsecretkey';
    const decoded = jwt.verify(token, jwtSecret);
    const userId = decoded.UID;

    const result = await pool.query('SELECT firstname, lastname, email FROM Users WHERE uid = $1', [userId]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Error fetching user details:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});








module.exports = router;


