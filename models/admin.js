const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    dropDups: true,
    default: 'admin',
  },
  password: {
    type: String,
    required: true,
    default: '123',
  },
  lastLogin: {
    type: Date,
  }
});

module.exports = mongoose.model('Admin', AdminSchema, 'admin');
