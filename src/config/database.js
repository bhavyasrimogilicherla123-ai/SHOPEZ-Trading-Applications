const mongoose = require('mongoose');
const { env } = require('./env');

let connectPromise;

async function connectDatabase() {
  mongoose.set('strictQuery', true);

  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (connectPromise) return connectPromise;

  connectPromise = mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    minPoolSize: 1,
  }).then(() => {
    console.log(`MongoDB connected (${mongoose.connection.host})`);
    return mongoose.connection;
  }).catch((error) => {
    connectPromise = undefined;
    throw error;
  });

  return connectPromise;
}

mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected; Mongoose will retry automatically.'));
mongoose.connection.on('reconnected', () => console.log('MongoDB reconnected'));
mongoose.connection.on('error', (error) => console.error('MongoDB connection error:', error.message));

module.exports = connectDatabase;
