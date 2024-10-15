const User = require('../models/User');
const jwt = require('jsonwebtoken');
const argon2 = require('argon2'); // Import argon2
const bcrypt = require('bcrypt');
require('dotenv').config();

// Register function
const register = async (req, res) => {
    const { username, email, password, userLevel } = req.body;

    try {
        if (!userLevel) {
            return res.status(400).json({ message: "userLevel is required." });
        }

        // Log the password before hashing for debugging
        console.log("Registering user with password:", password);

        // Hash the password using argon2
        const hashedPassword = await argon2.hash(password); // Argon2 automatically handles salt
        console.log("Hashed password:", hashedPassword); // Log the hashed password

        // Create a new user instance with the hashed password
        const newUser = new User({
            username,
            email,
            password, // Store the hashed password
            userLevel
        });

        // Save the new user to the database
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

// Login function
const login = async (req, res) => {
    const { email, password } = req.body;
    console.log("Login attempt for:", { email, password });

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        console.log("User found:", user);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Log the hashed password retrieved from the database
        console.log("User's hashed password from database:", user.password);

        let isMatch = false;

        // Check if the password is hashed using bcrypt or argon2
        if (user.password.startsWith('$2b$')) {
            // Bcrypt password
            console.log("Password hashed with bcrypt.");
            isMatch = await bcrypt.compare(password, user.password);
        } else if (user.password.startsWith('$argon2')) {
            // Argon2 password
            console.log("Password hashed with argon2.");
            isMatch = await argon2.verify(user.password, password);
        }

        console.log("Password match:", isMatch);

        if (!isMatch) {
            console.error("Passwords do not match for user:", email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create and sign a JWT token
        const token = jwt.sign({ userId: user._id, role: user.userLevel }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

// Get user profile function
const getProfile = async (req, res) => {
    const userId = req.user.id; // Assuming the user ID is stored in the token
    
    try {
        const user = await User.findById(userId).select('-password'); // Exclude password from the result
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: 'Error fetching user profile', error: error.message });
    }
};

// Export the functions
module.exports = {
    register,
    login,
    getProfile,
};

// Create a child account
const createChildAccount = async (req, res) => {
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
const linkChildAccount = async (req, res) => {
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
const unlinkChildAccount = async (req, res) => {
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
const viewChildAccounts = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await User.findById(userId).populate('children');
        res.status(200).json({ message: 'Child accounts retrieved successfully', children: user.children });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving child accounts', error: error.message });
    }
};

// Update user profile
const updateProfile = async (req, res) => {
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

        // Adjust content based on user's educational stage
        adjustContentForUserLevel(user);

        await user.save();
        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};

// Delete user account
const deleteAccount = async (req, res) => {
    const userId = req.user.id;
    try {
        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting account', error: error.message });
    }
};

// Create a formative assessment
const createAssessment = async (req, res) => {
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
const takeAssessment = async (req, res) => {
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
const getFeedback = async (req, res) => {
    const userId = req.user.id;
    try {
        const feedbackEntries = await Progress.find({ userId }).populate('assessmentId');
        res.status(200).json({ message: 'Feedback retrieved successfully', feedbackEntries });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving feedback', error: error.message });
    }
};

// Set learning goals
const setLearningGoals = async (req, res) => {
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
const viewLearningGoals = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await User.findById(userId);
        res.status(200).json({ message: 'Learning goals retrieved successfully', goals: user.learningGoals });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving learning goals', error: error.message });
    }
};

// View child's progress
const viewChildProgress = async (req, res) => {
    const { childId } = req.params;
    try {
        const childProgress = await Progress.find({ userId: childId }).populate('assessmentId');
        res.status(200).json({ message: 'Child progress retrieved successfully', progress: childProgress });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving child progress', error: error.message });
    }
};

// Get personalized learning recommendations
const getLearningRecommendations = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await User.findById(userId).populate('progress');
        const recommendations = await ResourceService.getRecommendations(user.learningGoals, user.progress);
        res.status(200).json({ message: 'Learning recommendations retrieved successfully', recommendations });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving learning recommendations', error: error.message });
    }
};

// Track user achievements
const getAchievements = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await User.findById(userId).populate('achievements');
        res.status(200).json({ message: 'Achievements retrieved successfully', achievements: user.achievements });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving achievements', error: error.message });
    }
};

// Send user notifications
const sendNotification = async (req, res) => {
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
const setParentalControls = async (req, res) => {
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
const logSelfReflection = async (req, res) => {
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
const searchResources = async (req, res) => {
    const { query } = req.body;
    try {
        const resources = await ResourceService.searchResources(query);
        res.status(200).json({ message: 'Resources retrieved successfully', resources });
    } catch (error) {
        res.status(500).json({ message: 'Error searching resources', error: error.message });
    }
};

// Get user details
const getUserDetails = async (req, res) => {
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
    getProfile,
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
    viewChildProgress,
    getLearningRecommendations,
    getAchievements,
    sendNotification,
    setParentalControls,
    logSelfReflection,
    searchResources,
    getUserDetails,
};
