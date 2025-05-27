const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');

let gridFS;

const connectToGridFS = async () => {
  if (!gridFS) {
    const conn = mongoose.connection;

    console.log('🔧 connectToGridFS: Initializing GridFSBucket...');
    
    gridFS = new GridFSBucket(conn.db, {
      bucketName: 'uploads'
    });

    console.log('✅ connectToGridFS: GridFSBucket created');
  }
};

const getGFSBucket = () => {
  if (!gridFS) {
    throw new Error('GridFSBucket is not initialized. Make sure connectToGridFS() was called.');
  }
  return gridFS;
};

module.exports = {
  connectToGridFS,
  getGFSBucket,
};
