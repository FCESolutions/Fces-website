require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path')

const { dbReady } = require('./db');

const app = express();
const allowedOrigin = process.env.CORS_ALLOWED_ORIGIN || 'http://localhost:8081';

app.use(cors({
  origin: allowedOrigin, // or 'http://localhost:3000' for stricter control
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true,
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});



// Start only when DB and GridFS are ready
dbReady
  .then(() => {
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
    app.use('/api/uploads', express.static(path.join(__dirname, 'uploads'))) 
    app.use('/api', require('./routes')); // ✅ Load routes here

    // Error handler
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ message: 'Something broke!' });
    });

    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to start server:', err);
  });
