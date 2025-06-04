// server/index.js
const cors = require('cors');

// 1. Load environment variables from .env
require('dotenv').config();

// 2. Import dependencies
const express = require('express');
const mongoose = require('mongoose');

// 2a. Import your route modules (auth + user)
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

const app = express();
app.use(cors({
    origin: 'http://localhost:3000'
  }));

const contentRoutes = require('./routes/content');
const quizRoutes = require('./routes/quiz');

// 3. Middleware to parse JSON bodies
app.use(express.json());
app.use('/uploads', express.static('uploads'));


// 4. Mount “public” authentication routes
//    (register + login are under /api/auth)
app.use('/api/auth', authRoutes);

// 5. Mount “private” user routes (profile, etc.)
//    These routes will use the auth middleware internally
app.use('/api/user', userRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/quiz', quizRoutes);


// 6. Basic “health check” route
app.get('/', (req, res) => {
  res.send('🚀 Server is running');
});

// 7. Read MongoDB URI from environment
const mongoURI = process.env.MONGO_URI || '';

// 8. Connect to MongoDB via Mongoose
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// 9. Start the server on PORT 5000 (or process.env.PORT)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🌐 Server listening on port ${PORT}`);
});
