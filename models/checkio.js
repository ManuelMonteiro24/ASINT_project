const mongoose = require('mongoose');

const CheckIOSchema = new mongoose.Schema({
  io: {
    type: Boolean, //in-true, out-false
  },
  username: {
    type: String,
  },
  timestamp: {
    type: Date,
  },
  roomId: {
    type: String,
  },
});

CheckIOSchema.pre('save', function(next) {
  this.timestamp = new Date(); //set timestamp before storing document in database
  next();
});

module.exports = mongoose.model('CheckIO', CheckIOSchema, 'checkio');
