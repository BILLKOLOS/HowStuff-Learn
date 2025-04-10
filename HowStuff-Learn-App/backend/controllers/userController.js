const User = require('../models/User');
const Child = require('../models/Child'); // Import Child model
const argon2 = require('argon2');
require('dotenv').config();
const jwt = require('jsonwebtoken');

// Register function
const register = async (req, res) => {
    const { username, email, password, role, childName, childGrade } = req.body;
    const normalizedEmail = email.toLowerCase();
    console.log("Request body:", req.body);
    console.log("Role:", role); // Log the role

    try {
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Username, email, and password are required.' });
        }
        if (role === 'student' && !childGrade) {
            return res.status(400).json({ message: 'Grade is required for students.' });
        }
        if (role === 'parent' && (!childName || !childGrade)) {
            return res.status(400).json({ message: 'Child name and grade are required for parents.' });
        }

        console.log("Registering user with password:", password);
        const hashedPassword = await argon2.hash(password);
        console.log("Hashed password:", hashedPassword);

        const newUser = new User({
            username,
            email: normalizedEmail,
            password, // Save the hashed passwords
            userLevel: role === 'student' ? childGrade : undefined,
            role
        });

        if (role === 'parent') {
            const child = new Child({ 
                name: childName, 
                grade: childGrade,
                curriculum: 'CBC',
                parent: newUser._id
            });
            await child.save();
            newUser.children = [child._id];
        }

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

module.exports = { register };

const login = async (req, res) => {
    const { email, password } = req.body;
    console.log("Login attempt for:", { email });

    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        console.log("User found:", user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await argon2.verify(user.password, password);
        console.log("Password match:", isMatch);
        
        if (!isMatch) {
            console.error("Passwords do not match for user:", email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const normalizedRole = user.role.toLowerCase();
        let redirectUrl;
        if (normalizedRole === 'parent') {
            redirectUrl = '/parent-dashboard';
        } else if (normalizedRole === 'student') {
            redirectUrl = '/dashboard';
        } else if (normalizedRole === 'user') {
            redirectUrl = '/dashboard'; // Add handling for 'user' role
        } else {
            console.error("403 Forbidden: Unhandled role detected", user.role);
            return res.status(403).json({ message: 'Invalid role detected' });
        }

        console.log("User role:", normalizedRole);
        console.log("Redirect URL:", redirectUrl);

        res.status(200).json({ message: 'Login successful', token, redirectUrl });
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

// Create a child account
const createChildAccount = async (req, res) => {
    const { username, email, password } = req.body;
    const userId = req.user.id;

    try {
        const hashedPassword = await argon2.hash(password);
        const newChild = new User({ username, email, password: hashedPassword, userType: 'child' });
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
            const hashedPassword = await argon2.hash(newPassword);
            user.password = hashedPassword;
        }
        user.username = username || user.username;
        user.email = email || user.email;

        // Adjust content based on user's educational stage
        // adjustContentForUserLevel(user); // Uncomment if this function exists

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
        feedback.details.push({ 
            question: question.questionText, 
            givenAnswer: answers[index], 
            isCorrect 
        });
        if (isCorrect) {
            feedback.correct++;
        } else {
            feedback.incorrect++;
        }
    });
    return feedback;
};

// Save progress and feedback
const saveProgress = async (userId, assessmentId, feedback) => {
    const progressEntry = new Progress({ 
        userId, 
        assessmentId, 
        feedback, 
        date: new Date() 
    });
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
