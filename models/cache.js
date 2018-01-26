const mongoose = require('mongoose');

const CacheSchema = mongoose.Schema({
  _id: { type: String },
  value: { type: Array },
  lastAccess: { type: Date },
});

module.exports = mongoose.model('Cache', CacheSchema, 'cache');
