const Skill = require('../models/Skill');

// Create a new skill
exports.createSkill = async (req, res) => {
    try {
        const skill = new Skill(req.body);
        await skill.save();
        res.status(201).json(skill);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all skills
exports.getAllSkills = async (req, res) => {
    try {
        const skills = await Skill.find();
        res.status(200).json(skills);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get skill by ID
exports.getSkillById = async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id);
        res.status(200).json(skill);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a skill
exports.updateSkill = async (req, res) => {
    try {
        const updatedSkill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedSkill);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a skill
exports.deleteSkill = async (req, res) => {
    try {
        await Skill.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Skill deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
