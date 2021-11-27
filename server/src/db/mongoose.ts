import mongoose from 'mongoose';

mongoose.connection.on('connected', () => {
  console.log('MongoDB Connection Established')
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB Connection Reestablished')
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB Connection Disconnected')
});

mongoose.connection.on('close', () => {
  console.log('MongoDB Connection Closed')
});

mongoose.connect(process.env.MONGODB_URI || 'reservations-secret');