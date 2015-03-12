var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  email: String,
  password: Buffer,
  salt: Buffer
});

module.exports = mongoose.model('User', userSchema);
