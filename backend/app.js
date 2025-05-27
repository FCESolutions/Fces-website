require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { dbReady } = require('./db');

const app = express();

app.use(cors({
  origin: 'http://localhost:8081', // or 'http://localhost:3000' for stricter control
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
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
