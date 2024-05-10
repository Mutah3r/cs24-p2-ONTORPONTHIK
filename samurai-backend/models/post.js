const mongoose = require('mongoose');

// Define schema
const postSchema = new mongoose.Schema({
  user_email: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  time:{
    type:Date
  }
});

// Create model
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
