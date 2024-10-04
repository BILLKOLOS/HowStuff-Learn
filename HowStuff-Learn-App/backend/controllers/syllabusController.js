const Syllabus = require('../models/Syllabus');
const CBCCompliance = require('../utils/CBCCompliance');

// Create a new syllabus
exports.createSyllabus = async (req, res) => {
    try {
        const newSyllabus = new Syllabus({
            courseId: req.body.courseId,
            title: req.body.title,
            description: req.body.description,
            content: req.body.content, // Array of syllabus sections/lessons
            createdBy: req.user.id,
        });

        await newSyllabus.save();
        res.status(201).json({ message: 'Syllabus created successfully.', syllabus: newSyllabus });
    } catch (error) {
        res.status(500).json({ message: 'Error creating syllabus.', error });
    }
};

// Update an existing syllabus
exports.updateSyllabus = async (req, res) => {
    try {
        const { syllabusId } = req.params;

        const updatedSyllabus = await Syllabus.findByIdAndUpdate(
            syllabusId,
            {
                title: req.body.title,
                description: req.body.description,
                content: req.body.content, // Update syllabus sections
            },
            { new: true }
        );

        if (!updatedSyllabus) {
            return res.status(404).json({ message: 'Syllabus not found.' });
        }

        res.status(200).json({ message: 'Syllabus updated successfully.', syllabus: updatedSyllabus });
    } catch (error) {
        res.status(500).json({ message: 'Error updating syllabus.', error });
    }
};

// Delete a syllabus
exports.deleteSyllabus = async (req, res) => {
    try {
        const { syllabusId } = req.params;

        const deletedSyllabus = await Syllabus.findByIdAndDelete(syllabusId);

        if (!deletedSyllabus) {
            return res.status(404).json({ message: 'Syllabus not found.' });
        }

        res.status(200).json({ message: 'Syllabus deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting syllabus.', error });
    }
};

// Get a syllabus by courseId
exports.getSyllabusByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        const syllabus = await Syllabus.findOne({ courseId });

        if (!syllabus) {
            return res.status(404).json({ message: 'Syllabus not found for this course.' });
        }

        res.status(200).json({ message: 'Syllabus retrieved successfully.', syllabus });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving syllabus.', error });
    }
};

// Validate syllabus compliance with CBC standards
exports.checkCBCCompliance = async (req, res) => {
    try {
        const { syllabusId } = req.params;

        const syllabus = await Syllabus.findById(syllabusId);
        if (!syllabus) {
            return res.status(404).json({ message: 'Syllabus not found.' });
        }

        // Validate the syllabus against CBC standards
        const isCompliant = CBCCompliance.validateSyllabus(syllabus);

        if (!isCompliant) {
            return res.status(400).json({ message: 'Syllabus does not meet CBC compliance standards.' });
        }

        res.status(200).json({ message: 'Syllabus meets CBC compliance standards.' });
    } catch (error) {
        res.status(500).json({ message: 'Error checking CBC compliance.', error });
    }
};
