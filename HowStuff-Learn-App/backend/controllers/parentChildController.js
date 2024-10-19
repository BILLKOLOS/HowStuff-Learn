const ParentChildAccount = require('../models/ParentChildAccount');
const User = require('../models/User');
const Progress = require('../models/Progress');
const CBCEnrollment = require('../models/CBCEnrollment');

// Link child account to parent
const linkChildToParent = async (req, res) => {
    try {
        const { parentId, childId, childName, gradeLevel, curriculum } = req.body;

        // Ensure parent and child exist
        const parent = await User.findById(parentId);
        const child = await User.findById(childId);

        if (!parent || !child) {
            return res.status(404).json({ message: "Parent or child not found." });
        }

        // Check if user roles are correct (Parent and Child)
        if (parent.role !== 'parent') {
            return res.status(403).json({ message: "User is not authorized to link child accounts." });
        }

        if (child.role !== 'student') {
            return res.status(403).json({ message: "Cannot link non-student accounts as a child." });
        }

        // Create the parent-child link
        const parentChildLink = new ParentChildAccount({
            parentId: parent._id,
            childId: child._id,
            accountType: 'Parent', // You can set this based on your requirement
            relationshipType: 'Biological', // Adjust as necessary
        });

        await parentChildLink.save();

        // Enroll child in CBC curriculum
        const enrollment = new CBCEnrollment({
            studentId: childId,
            gradeLevel: gradeLevel,
            curriculum: 'CBC',
        });
        await enrollment.save();

        res.status(201).json({ message: "Child successfully linked to parent and enrolled in CBC curriculum.", parentChildLink });
    } catch (error) {
        res.status(500).json({ message: "Error linking child to parent.", error });
    }
};

// View child's progress by parent
const viewChildProgress = async (req, res) => {
    try {
        const { parentId, childId } = req.params;

        // Ensure parent-child relationship exists
        const relationship = await ParentChildAccount.findOne({ parentId, childId });

        if (!relationship) {
            return res.status(404).json({ message: "No parent-child relationship found." });
        }

        // Get child progress data
        const childProgress = await Progress.find({ userId: childId });

        res.status(200).json({ message: "Child's progress retrieved successfully.", childProgress });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving child's progress.", error });
    }
};

// Unlink child from parent
const unlinkChildFromParent = async (req, res) => {
    try {
        const { parentId, childId } = req.body;

        // Find and delete parent-child relationship
        const relationship = await ParentChildAccount.findOneAndDelete({ parentId, childId });

        if (!relationship) {
            return res.status(404).json({ message: "No parent-child relationship found to unlink." });
        }

        res.status(200).json({ message: "Child successfully unlinked from parent." });
    } catch (error) {
        res.status(500).json({ message: "Error unlinking child from parent.", error });
    }
};

// Get all linked children of a parent
const getLinkedChildren = async (req, res) => {
    try {
        const { parentId } = req.params;

        // Find all children linked to the parent
        const childrenLinks = await ParentChildAccount.find({ parentId }).populate('childId');

        if (!childrenLinks.length) {
            return res.status(404).json({ message: "No children linked to this parent." });
        }

        res.status(200).json({ message: "Linked children retrieved successfully.", children: childrenLinks });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving linked children.", error });
    }
};

module.exports = {
    linkChildToParent,
    viewChildProgress,
    unlinkChildFromParent,
    getLinkedChildren
};
