// models/PastPaper.js

const mongoose = require('mongoose');

// Define the schema for a past paper
const pastPaperSchema = new mongoose.Schema({
  institution: {
    type: String,
    required: true,
  },
  school: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  yearSemester: {
    type: String,
    required: true,
    match: [/^\d{4} Semester \d$/, 'Invalid year and semester format'], // Example: 2023 Semester 1
  },
  title: {
    type: String,
    required: true,
    unique: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  preview: {
    type: String,
    required: true,
    maxlength: [500, 'Preview text cannot exceed 500 characters'],
  },
  file: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  version: {
    type: Number,
    default: 1,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  tags: {
    type: [String], // Optional tags to categorize the paper
  },
  difficultyLevel: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  lastAccessed: {
    type: Date,
  },
}, { timestamps: true });

// Add an index to improve search performance
pastPaperSchema.index({ institution: 1, school: 1, department: 1, course: 1, yearSemester: 1 });
pastPaperSchema.index({ title: 'text', preview: 'text' }); // Full-text search for title and preview

// Create the model
const PastPaper = mongoose.model('PastPaper', pastPaperSchema);

module.exports = PastPaper;
