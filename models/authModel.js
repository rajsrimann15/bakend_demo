const mongoose = require('mongoose');

// Define the schema if not already defined
const userSchema = mongoose.Schema({
  googleId: String,
  displayName: String,
  email: String,
  accessToken: String,
});

// Check if the model already exists to prevent redefining
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;