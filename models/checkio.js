const mongoose = require('mongoose');

const CheckIOSchema = new mongoose.Schema({
  io: {
    type: Boolean, //in-true, out-false
  },
  displayName: {
    type: String,
  },
  username: {
    type: String,
  },
  roomId: {
    type: String,
  },
  roomName: {
    type: String,
  },
  timestamp: {
    type: Date,
  },
});

CheckIOSchema.pre('save', function(next) {
  this.timestamp = new Date(); //set timestamp before storing document in database
  next();
});

module.exports = mongoose.model('CheckIO', CheckIOSchema, 'checkio');
