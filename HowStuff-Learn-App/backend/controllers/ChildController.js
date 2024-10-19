const Child = require('../models/Child');

// Create a child
const createChild = async (req, res) => {
  const { name, grade, curriculum } = req.body;
  const parentId = req.user._id; // Destructured parent ID

  // Validation checks
  if (!name || !grade || !curriculum) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const newChild = new Child({
      name,
      grade,
      curriculum,
      parent: parentId
    });

    await newChild.save();
    res.status(201).json({ message: 'Child created successfully!', child: newChild });
  } catch (error) {
    res.status(500).json({ error: 'Error creating child: ' + error.message });
  }
};

// Get children for a parent
const getChildren = async (req, res) => {
  const parentId = req.user._id; // Destructured parent ID

  try {
    const children = await Child.find({ parent: parentId });
    res.status(200).json(children);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching children: ' + error.message });
  }
};

// Update a child
const updateChild = async (req, res) => {
  const { childId, name, grade, curriculum } = req.body;
  const parentId = req.user._id; // Destructured parent ID

  try {
    const updatedChild = await Child.findOneAndUpdate(
      { _id: childId, parent: parentId },
      { name, grade, curriculum },
      { new: true, runValidators: true }
    );

    if (!updatedChild) {
      return res.status(404).json({ error: 'Child not found or not authorized.' });
    }

    res.status(200).json({ message: 'Child updated successfully!', child: updatedChild });
  } catch (error) {
    res.status(500).json({ error: 'Error updating child: ' + error.message });
  }
};

// Delete a child
const deleteChild = async (req, res) => {
  const { childId } = req.params;
  const parentId = req.user._id; // Destructured parent ID

  try {
    const deletedChild = await Child.findOneAndDelete({
      _id: childId,
      parent: parentId
    });

    if (!deletedChild) {
      return res.status(404).json({ error: 'Child not found or not authorized.' });
    }

    res.status(200).json({ message: 'Child deleted successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting child: ' + error.message });
  }
};

module.exports = {
  createChild,
  getChildren,
  updateChild,
  deleteChild
};
