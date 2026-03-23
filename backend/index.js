const express = require('express');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
const corsOptions = {
  origin: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL, 'http://localhost:5173'] : '*',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan('dev'));

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/auth', apiLimiter);
app.use('/api/logs', apiLimiter);
app.use('/api/goals', apiLimiter);

// Debug Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/logs', require('./routes/logs'));
app.use('/api/timetable', require('./routes/timetable'));
app.use('/api/daily-tasks', require('./routes/dailyTasks'));
app.use('/api/feedback', require('./routes/feedback'));

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'Consistency Tracker API is running' });
});

// Database Connection
// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
    });
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('Please check your MONGODB_URI in the .env file.');
    // Start server anyway for debugging API endpoints that don't need DB (if any)
    // Or just exit if DB is strictly required. 
    // Here we'll exit but with a clear message.
    process.exit(1);
  }
};

connectDB();

// Global Error Handler
const fs = require('fs');
app.use((err, req, res, next) => {
  const errorLog = `[${new Date().toISOString()}] ${err.stack}\n`;
  fs.appendFileSync('error.log', errorLog);
  console.error('SERVER ERROR:', err.stack);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});
