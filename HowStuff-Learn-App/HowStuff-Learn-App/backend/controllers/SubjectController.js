const Subject = require('../models/Subject');

// Create a new subject
exports.createSubject = async (req, res) => {
    try {
        const newSubject = new Subject(req.body);
        await newSubject.save();
        res.status(201).json(newSubject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all subjects
exports.getAllSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find();
        res.status(200).json(subjects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a subject by ID
exports.getSubjectById = async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id);
        res.status(200).json(subject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a subject
exports.updateSubject = async (req, res) => {
    try {
        const updatedSubject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedSubject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a subject
exports.deleteSubject = async (req, res) => {
    try {
        await Subject.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Subject deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
