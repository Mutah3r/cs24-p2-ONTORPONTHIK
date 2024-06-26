const mongoose = require('mongoose');

// Define schema
const feedbackSchema = new mongoose.Schema({
  user_email: {
    type: String,
    default: "anonymous"
  },
  role: {
    type: String,
  },
  location: {
    type: String,
  },
  type: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  seen_status: {
    type : Boolean,
    required: true,
    default:false
  }
});

// Create model
const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
