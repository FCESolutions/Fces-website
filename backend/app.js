require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan'); // HTTP request logger middleware for Node.js


const app = express();

require('./db');

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// Routes
app.use('/api', require('./routes'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke!' });
  });

app.listen(process.env.PORT, () => { // start the server and listen on the specified port
    console.log(`Server started on port`, process.env.PORT); // log a message to the console indicating that the server has started
});
