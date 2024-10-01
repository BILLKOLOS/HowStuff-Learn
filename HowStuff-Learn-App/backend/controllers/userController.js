// Import necessary modules
const User = require('../models/User');
const Assessment = require('../models/Assessment');
const Progress = require('../models/Progress');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ResourceService = require('../utils/resourceService');

// User registration
exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

// User login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

// Create a child account
exports.createChildAccount = async (req, res) => {
    const { username, email, password } = req.body;
    const userId = req.user.id;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newChild = new User({ username, email, password: hashedPassword, role: 'child' });
        await newChild.save();

        const user = await User.findById(userId);
        user.children.push(newChild._id);
        await user.save();

        res.status(201).json({ message: 'Child account created successfully', child: newChild });
    } catch (error) {
        res.status(500).json({ message: 'Error creating child account', error: error.message });
    }
};

// Link child's account
exports.linkChildAccount = async (req, res) => {
    const { childAccount } = req.body;
    const userId = req.user.id;
    try {
        const user = await User.findById(userId);
        user.children.push(childAccount);
        await user.save();
        res.status(200).json({ message: 'Child account linked successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error linking child account', error: error.message });
    }
};

// Unlink child's account
exports.unlinkChildAccount = async (req, res) => {
    const { childAccountId } = req.body;
    const userId = req.user.id;
    try {
        const user = await User.findById(userId);
        user.children = user.children.filter(childId => childId.toString() !== childAccountId);
        await user.save();
        res.status(200).json({ message: 'Child account unlinked successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error unlinking child account', error: error.message });
    }
};

// View child's accounts
exports.viewChildAccounts = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await User.findById(userId).populate('children');
        res.status(200).json({ message: 'Child accounts retrieved successfully', children: user.children });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving child accounts', error: error.message });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    const { username, email } = req.body;
    const userId = req.user.id;
    try {
        const user = await User.findByIdAndUpdate(userId, { username, email }, { new: true });
        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};

// Delete user account
exports.deleteAccount = async (req, res) => {
    const userId = req.user.id;
    try {
        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting account', error: error.message });
    }
};
// Update Profile and Password
exports.updateProfile = async (req, res) => {
    const { username, email, newPassword } = req.body;
    const userId = req.user.id;
    try {
        const user = await User.findById(userId);
        if (newPassword) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
        }
        user.username = username || user.username;
        user.email = email || user.email;
        await user.save();

        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};

// Create a formative assessment
exports.createAssessment = async (req, res) => {
    const { title, questions } = req.body;
    const userId = req.user.id;
    try {
        const newAssessment = new Assessment({ title, questions, createdBy: userId });
        await newAssessment.save();
        res.status(201).json({ message: 'Assessment created successfully', assessment: newAssessment });
    } catch (error) {
        res.status(500).json({ message: 'Error creating assessment', error: error.message });
    }
};

// Take an assessment
exports.takeAssessment = async (req, res) => {
    const { assessmentId, answers } = req.body;
    const userId = req.user.id;
    try {
        const assessment = await Assessment.findById(assessmentId);
        if (!assessment) return res.status(404).json({ message: 'Assessment not found' });

        const feedback = evaluateAssessment(assessment.questions, answers);
        await saveProgress(userId, assessmentId, feedback);

        res.status(200).json({ message: 'Assessment submitted successfully', feedback });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting assessment', error: error.message });
    }
};

// Function to evaluate assessment
const evaluateAssessment = (questions, answers) => {
    const feedback = { correct: 0, incorrect: 0, details: [] };
    questions.forEach((question, index) => {
        const isCorrect = question.correctAnswer === answers[index];
        feedback.details.push({ question: question.questionText, givenAnswer: answers[index], isCorrect });
        if (isCorrect) feedback.correct++;
        else feedback.incorrect++;
    });
    return feedback;
};

// Save progress and feedback
const saveProgress = async (userId, assessmentId, feedback) => {
    const progressEntry = new Progress({ userId, assessmentId, feedback, date: new Date() });
    await progressEntry.save();
};

// Get assessment feedback for a student
exports.getFeedback = async (req, res) => {
    const userId = req.user.id;
    try {
        const feedbackEntries = await Progress.find({ userId }).populate('assessmentId');
        res.status(200).json({ message: 'Feedback retrieved successfully', feedbackEntries });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving feedback', error: error.message });
    }
};

// Set learning goals
exports.setLearningGoals = async (req, res) => {
    const { goals } = req.body;
    const userId = req.user.id;
    try {
        const user = await User.findById(userId);
        user.learningGoals = goals;
        await user.save();
        res.status(200).json({ message: 'Learning goals set successfully', goals });
    } catch (error) {
        res.status(500).json({ message: 'Error setting learning goals', error: error.message });
    }
};

// View learning goals
exports.viewLearningGoals = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await User.findById(userId);
        res.status(200).json({ message: 'Learning goals retrieved successfully', goals: user.learningGoals });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving learning goals', error: error.message });
    }
};
// View child's progress
exports.viewChildProgress = async (req, res) => {
    const { childId } = req.params;
    try {
        const childProgress = await Progress.find({ userId: childId }).populate('assessmentId');
        res.status(200).json({ message: 'Child progress retrieved successfully', progress: childProgress });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving child progress', error: error.message });
    }
};

// Get personalized learning recommendations
exports.getLearningRecommendations = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await User.findById(userId);
        const recommendations = await ResourceService.getRecommendations(user.learningGoals, user.progress);
        res.status(200).json({ message: 'Learning recommendations retrieved successfully', recommendations });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving learning recommendations', error: error.message });
    }
};

// Track user achievements
exports.getAchievements = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await User.findById(userId).populate('achievements');
        res.status(200).json({ message: 'Achievements retrieved successfully', achievements: user.achievements });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving achievements', error: error.message });
    }
};

// Send user notifications
exports.sendNotification = async (req, res) => {
    const { userId, message } = req.body;
    try {
        const user = await User.findById(userId);
        user.notifications.push({ message, date: new Date() });
        await user.save();
        res.status(200).json({ message: 'Notification sent successfully', notifications: user.notifications });
    } catch (error) {
        res.status(500).json({ message: 'Error sending notification', error: error.message });
    }
};

// Set parental control restrictions
exports.setParentalControls = async (req, res) => {
    const { childId, restrictions } = req.body;
    try {
        const child = await User.findById(childId);
        child.parentalControls = restrictions;
        await child.save();
        res.status(200).json({ message: 'Parental controls set successfully', restrictions: child.parentalControls });
    } catch (error) {
        res.status(500).json({ message: 'Error setting parental controls', error: error.message });
    }
};
// Log self-reflection
exports.logSelfReflection = async (req, res) => {
    const { reflection } = req.body;
    const userId = req.user.id;
    try {
        const user = await User.findById(userId);
        user.reflections.push({ reflectionText: reflection, createdAt: new Date() });
        await user.save();
        res.status(200).json({ message: 'Self-reflection logged successfully', reflection });
    } catch (error) {
        res.status(500).json({ message: 'Error logging self-reflection', error: error.message });
    }
};

// Search resources
exports.searchResources = async (req, res) => {
    const { query } = req.body;
    try {
        const resources = await ResourceService.searchResources(query);
        res.status(200).json({ message: 'Resources retrieved successfully', resources });
    } catch (error) {
        res.status(500).json({ message: 'Error searching resources', error: error.message });
    }
};

// Get user details
exports.getUserDetails = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await User.findById(userId).populate('children');
        res.status(200).json({ message: 'User details retrieved successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user details', error: error.message });
    }
};

// Export all user controller functions
module.exports = {
    register,
    login,
    createChildAccount,
    linkChildAccount,
    unlinkChildAccount,
    viewChildAccounts,
    updateProfile,
    deleteAccount,
    createAssessment,
    takeAssessment,
    getFeedback,
    setLearningGoals,
    viewLearningGoals,
    logSelfReflection,
    searchResources,
    getUserDetails,
};
