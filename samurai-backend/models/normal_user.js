const mongoose = require('mongoose');

// Define schema
const normalUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: "Citizen user"
  }
});

// Create model
const NormalUser = mongoose.model('NormalUser', normalUserSchema);

module.exports = NormalUser;
