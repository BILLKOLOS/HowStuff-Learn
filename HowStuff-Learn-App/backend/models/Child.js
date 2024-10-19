const mongoose = require('mongoose');
const { Schema } = mongoose;

const childSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  grade: {
    type: String,
    required: true
  },
  curriculum: {
    type: String,
    required: true, // CBC, Other, etc.
    enum: ['CBC', 'Other'], // Define accepted values for curriculum
    default: 'CBC' // Optional: Default value
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true // Link to the parent
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to update the 'updatedAt' field before saving
childSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Child = mongoose.model('Child', childSchema);
module.exports = Child;
