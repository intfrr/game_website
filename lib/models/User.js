var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  email: String,
  password: Buffer,
  salt: Buffer,
  reset: {
    status: { type: Boolean, default: false },
    requestedAt: { type: Date, default: null },
    token: { type: String, default: null }
  }
});

module.exports = mongoose.model('User', userSchema);
