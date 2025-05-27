// db.js
require('dotenv').config();
const mongoose = require('mongoose');
const { connectToGridFS } = require('./config/gridfs');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const dbReady = new Promise((resolve, reject) => {
  mongoose.connection.once('open', async () => {
    console.log('✅ Connected to MongoDB');
    try {
      await connectToGridFS();
      console.log('✅ GridFS Initialized');
      resolve();
    } catch (err) {
      reject(err);
    }
  });

  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB error:', err);
    reject(err);
  });
});

module.exports = {
  mongoose,
  dbReady,
};
