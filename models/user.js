const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  state: {
    type: Boolean, //online-true, offline-false
  },
  lastCheckIn: {
    type: Date,
  },
});

UserSchema.pre('save', function(next) {
  if(this.isModified('state') && this.state){ //if state was modified to online, update lastCheckIn
    this.set('lastCheckIn', new Date());
  }
  next();
}).pre('update', function(next) {
  //TODO: same as above, 'this' is mongoose.Query object here
  if(this.getUpdate().$set)
  next();
});

module.exports = mongoose.model('User', UserSchema, 'users');
