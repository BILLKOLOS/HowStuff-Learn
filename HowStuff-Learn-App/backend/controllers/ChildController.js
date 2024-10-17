const Child = require('../models/Child');

exports.createChild = async (req, res) => {
    const { name, grade } = req.body;

    try {
        const newChild = new Child({
            name,
            grade,
            parent: req.user._id, // Assuming user is authenticated and parent ID is available
        });

        await newChild.save();
        res.status(201).json({ message: 'Child created successfully!', child: newChild });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getChildren = async (req, res) => {
    try {
        const children = await Child.find({ parent: req.user._id }); // Fetch children linked to the authenticated parent
        res.status(200).json(children);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateChild = async (req, res) => {
    const { childId, name, grade } = req.body;

    try {
        const updatedChild = await Child.findOneAndUpdate(
            { _id: childId, parent: req.user._id }, // Ensure the parent owns the child record
            { name, grade },
            { new: true, runValidators: true } // Return the updated document
        );

        if (!updatedChild) {
            return res.status(404).json({ error: 'Child not found or not authorized.' });
        }

        res.status(200).json({ message: 'Child updated successfully!', child: updatedChild });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteChild = async (req, res) => {
    const { childId } = req.params;

    try {
        const deletedChild = await Child.findOneAndDelete({ _id: childId, parent: req.user._id }); // Ensure the parent owns the child record

        if (!deletedChild) {
            return res.status(404).json({ error: 'Child not found or not authorized.' });
        }

        res.status(200).json({ message: 'Child deleted successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
