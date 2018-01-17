const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  name: {
    type: String, //ex: V0.2, GA5 ??
    required: true,
  },
  checkedInUsers: {
    type: Array,
  },
  messages: {
    type: Array,
  },
  lastAccess: {
    type: Number, //for cache management. Doc with lower 'lastAccess' is replaced by newly accessed instance
  }
});

module.exports = mongoose.model('Room', RoomSchema, 'rooms');
