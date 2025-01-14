const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const dashboardRoutes = require('./routes/dashboard') // Import the new projects route

dotenv.config();

const app = express();

// CORS Configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Your React app's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'User-ID'], // Ensure 'User-ID' is allowed
  credentials: true,
  optionsSuccessStatus: 200
};

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Apply CORS middleware
app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/projects', projectRoutes); // Use the new projects route
app.use('/dashboard', dashboardRoutes); // Use the new projects route

// Preflight request handler
app.options('*', cors(corsOptions));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
