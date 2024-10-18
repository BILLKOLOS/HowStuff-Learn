// models/Child.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const childSchema = new Schema({
    name: { type: String, required: true },
    grade: { type: String, required: true }
});

const Child = mongoose.model('Child', childSchema);
module.exports = Child;
