const CBCCompliance = require('../models/CBCCompliance');
const Syllabus = require('../models/Syllabus');

// Create a new CBC compliance record
exports.createCBCCompliance = async (req, res) => {
    try {
        const newCompliance = new CBCCompliance({
            curriculumLevel: req.body.curriculumLevel, // E.g. Primary, Secondary, University
            subject: req.body.subject,
            description: req.body.description,
            requirements: req.body.requirements, // Array of required components for CBC alignment
            createdBy: req.user.id,
        });

        await newCompliance.save();
        res.status(201).json({ message: 'CBC compliance record created successfully.', compliance: newCompliance });
    } catch (error) {
        res.status(500).json({ message: 'Error creating CBC compliance record.', error });
    }
};

// Update an existing CBC compliance record
exports.updateCBCCompliance = async (req, res) => {
    try {
        const { complianceId } = req.params;

        const updatedCompliance = await CBCCompliance.findByIdAndUpdate(
            complianceId,
            {
                curriculumLevel: req.body.curriculumLevel,
                subject: req.body.subject,
                description: req.body.description,
                requirements: req.body.requirements, // Update CBC requirements
            },
            { new: true }
        );

        if (!updatedCompliance) {
            return res.status(404).json({ message: 'CBC compliance record not found.' });
        }

        res.status(200).json({ message: 'CBC compliance record updated successfully.', compliance: updatedCompliance });
    } catch (error) {
        res.status(500).json({ message: 'Error updating CBC compliance record.', error });
    }
};

// Delete a CBC compliance record
exports.deleteCBCCompliance = async (req, res) => {
    try {
        const { complianceId } = req.params;

        const deletedCompliance = await CBCCompliance.findByIdAndDelete(complianceId);

        if (!deletedCompliance) {
            return res.status(404).json({ message: 'CBC compliance record not found.' });
        }

        res.status(200).json({ message: 'CBC compliance record deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting CBC compliance record.', error });
    }
};

// Get all CBC compliance records
exports.getAllCBCCompliance = async (req, res) => {
    try {
        const complianceRecords = await CBCCompliance.find();
        res.status(200).json({ message: 'CBC compliance records retrieved successfully.', complianceRecords });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving CBC compliance records.', error });
    }
};

// Get CBC compliance by curriculum level
exports.getCBCComplianceByLevel = async (req, res) => {
    try {
        const { curriculumLevel } = req.params;

        const complianceRecord = await CBCCompliance.findOne({ curriculumLevel });

        if (!complianceRecord) {
            return res.status(404).json({ message: 'CBC compliance record not found for this level.' });
        }

        res.status(200).json({ message: 'CBC compliance record retrieved successfully.', compliance: complianceRecord });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving CBC compliance record.', error });
    }
};

// Check if a syllabus is CBC compliant
exports.checkSyllabusCompliance = async (req, res) => {
    try {
        const { syllabusId } = req.params;

        const syllabus = await Syllabus.findById(syllabusId);
        if (!syllabus) {
            return res.status(404).json({ message: 'Syllabus not found.' });
        }

        // Assuming compliance check involves a comparison between syllabus and CBC compliance records
        const complianceRecords = await CBCCompliance.find({ subject: syllabus.subject });
        const isCompliant = complianceRecords.some(record => {
            // Implement actual compliance logic based on curriculumLevel and requirements
            return record.requirements.every(req => syllabus.content.includes(req));
        });

        if (!isCompliant) {
            return res.status(400).json({ message: 'Syllabus is not compliant with CBC standards.' });
        }

        res.status(200).json({ message: 'Syllabus is CBC compliant.' });
    } catch (error) {
        res.status(500).json({ message: 'Error checking CBC compliance for syllabus.', error });
    }
};
