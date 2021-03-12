const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Unique email for each user so we can,t use same email for another account
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    // User Image
    type: String,
  },
  role: {
    // Role of user it will be (normal or admin )
    type: Number,
    default: 0,
  },
  history: {
    // order history
    type: Array,
    default: [],
  },
});

module.exports = User = mongoose.model('User', UserSchema);
