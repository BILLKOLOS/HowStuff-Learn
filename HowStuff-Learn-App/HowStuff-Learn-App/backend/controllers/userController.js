// Import necessary modules
const User = require('../models/User');
const Assessment = require('../models/Assessment'); // Model for assessments
const Progress = require('../models/Progress'); // Model for progress tracking
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ResourceService = require('../utils/resourceService'); // Service to handle OpenAI and Wikipedia integration

// User registration
exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

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
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

// Create a child account
exports.createChildAccount = async (req, res) => {
    const { username, email, password } = req.body; // Details for the child account
    const userId = req.user.id; // Parent's user ID

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the child's password
        const newChild = new User({
            username,
            email,
            password: hashedPassword,
            role: 'child', // Set role as child
        });

        await newChild.save();

        // Link the child account to the parent
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
    const { childAccount } = req.body; // Assuming childAccount is an ObjectId
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        user.children.push(childAccount); // Use children array
        await user.save();
        res.status(200).json({ message: 'Child account linked successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error linking child account', error: error.message });
    }
};

// Unlink child's account
exports.unlinkChildAccount = async (req, res) => {
    const { childAccountId } = req.body; // ID of the child account to unlink
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
        const user = await User.findById(userId).populate('children'); // Populate child accounts
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

// Create a formative assessment
exports.createAssessment = async (req, res) => {
    const { title, questions } = req.body; // Title and questions for the assessment
    const userId = req.user.id; // User creating the assessment (teacher/admin)

    try {
        const newAssessment = new Assessment({
            title,
            questions,
            createdBy: userId,
        });
        await newAssessment.save();
        res.status(201).json({ message: 'Assessment created successfully', assessment: newAssessment });
    } catch (error) {
        res.status(500).json({ message: 'Error creating assessment', error: error.message });
    }
};

// Take an assessment
exports.takeAssessment = async (req, res) => {
    const { assessmentId, answers } = req.body; // Assessment ID and student's answers
    const userId = req.user.id; // ID of the student taking the assessment

    try {
        const assessment = await Assessment.findById(assessmentId);
        if (!assessment) {
            return res.status(404).json({ message: 'Assessment not found' });
        }

        // Evaluate answers and provide feedback
        const feedback = evaluateAssessment(assessment.questions, answers); // Assume this function evaluates answers
        await saveProgress(userId, assessmentId, feedback); // Save progress and feedback

        res.status(200).json({ message: 'Assessment submitted successfully', feedback });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting assessment', error: error.message });
    }
};

// Function to evaluate assessment (simplified)
const evaluateAssessment = (questions, answers) => {
    const feedback = {
        correct: 0,
        incorrect: 0,
        details: [],
    };

    questions.forEach((question, index) => {
        const isCorrect = question.correctAnswer === answers[index];
        feedback.details.push({
            question: question.questionText,
            givenAnswer: answers[index],
            isCorrect,
        });
        if (isCorrect) {
            feedback.correct++;
        } else {
            feedback.incorrect++;
        }
    });

    return feedback; // Return feedback object
};

// Save progress and feedback
const saveProgress = async (userId, assessmentId, feedback) => {
    const progressEntry = new Progress({
        userId,
        assessmentId,
        feedback,
        date: new Date(),
    });

    await progressEntry.save(); // Save the progress entry to the database
};

// Get assessment feedback for a student
exports.getFeedback = async (req, res) => {
    const userId = req.user.id;

    try {
        const feedbackEntries = await Progress.find({ userId }).populate('assessmentId'); // Populate assessment details
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
        user.learningGoals = goals; // Assuming learningGoals is a field in the User model
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

// Log self-reflection
exports.logSelfReflection = async (req, res) => {
    const { reflection } = req.body; // Student's reflection input
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        user.reflections.push({ reflectionText: reflection, createdAt: new Date() }); // Assuming reflections is an array in the User model
        await user.save();
        res.status(200).json({ message: 'Self-reflection logged successfully', reflection });
    } catch (error) {
        res.status(500).json({ message: 'Error logging self-reflection', error: error.message });
    }
};

// Search resources
exports.searchResources = async (req, res) => {
    const { query } = req.body; // Search query provided by the user

    try {
        // Use ResourceService to search for educational resources
        const resources = await ResourceService.searchResources(query); // This should handle OpenAI and Wikipedia integration
        res.status(200).json({ message: 'Resources retrieved successfully', resources });
    } catch (error) {
        res.status(500).json({ message: 'Error searching resources', error: error.message });
    }
};

// Get user details
exports.getUserDetails = async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId).populate('children'); // Populate children
        res.status(200).json({ message: 'User details retrieved successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user details', error: error.message });
    }
};

// Update user password
exports.updatePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Old password is incorrect' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating password', error: error.message });
    }
};

// Delete child's account
exports.deleteChildAccount = async (req, res) => {
    const { childAccountId } = req.body; // ID of the child account to delete
    const userId = req.user.id;

    try {
        // Delete the child account
        await User.findByIdAndDelete(childAccountId);
        
        // Unlink the child account from the parent
        const user = await User.findById(userId);
        user.children = user.children.filter(childId => childId.toString() !== childAccountId);
        await user.save();

        res.status(200).json({ message: 'Child account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting child account', error: error.message });
    }
};
