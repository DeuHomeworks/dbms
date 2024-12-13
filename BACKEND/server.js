const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();

// CORS Configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Your React app's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
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

// Preflight request handler
app.options('*', cors(corsOptions));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
