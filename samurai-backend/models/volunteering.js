const mongoose = require('mongoose');

// Define volunteer schema
const volunteerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  contact_number: {
    type: String,
    required: true
  }
});

// Define volunteering schema
const volunteeringSchema = new mongoose.Schema({
  type_of_work: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date_of_work: {
    type: Date,
    required: true
  },
  volunteers: [volunteerSchema]
});

// Create model
const Volunteering = mongoose.model('Volunteering', volunteeringSchema);

module.exports = Volunteering;
