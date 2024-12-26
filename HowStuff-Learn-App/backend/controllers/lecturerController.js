const Lecturer = require('../models/Lecturer'); // Ensure you are using the correct path for the Lecturer model
const jwt = require('jsonwebtoken');

// Create a new lecturer
exports.createLecturer = async (req, res) => {
    const { name, email, phone, uniqueCode } = req.body;

    try {
        // Check if a lecturer with the same uniqueCode already exists
        const existingLecturer = await Lecturer.findOne({ uniqueCode });
        if (existingLecturer) {
            return res.status(400).json({ message: 'Lecturer with this unique code already exists' });
        }

        // Create a new lecturer
        const newLecturer = new Lecturer({
            name,
            email,
            phone,
            uniqueCode,
        });

        await newLecturer.save();
        res.status(201).json({
            message: 'Lecturer created successfully!',
            data: newLecturer,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating lecturer' });
    }
};

// Lecturer login
exports.login = async (req, res) => {
    const { uniqueCode } = req.body;

    try {
        // Find lecturer by uniqueCode
        const lecturer = await Lecturer.findOne({ uniqueCode });
        if (!lecturer) {
            return res.status(404).json({ message: 'Invalid unique code or lecturer not found' });
        }

        // Generate a JWT access token
        const accessToken = jwt.sign(
            { id: lecturer._id, role: 'lecturer' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Generate a JWT refresh token
        const refreshToken = jwt.sign(
            { id: lecturer._id, role: 'lecturer' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Respond with user (lecturer) details, accessToken, and refreshToken
        res.status(200).json({
            message: 'Login successful',
            accessToken, // Include access token
            refreshToken, // Include refresh token
            user: { // Return the user details instead of lecturer
                name: lecturer.name,
                email: lecturer.email,
                phoneNumber: lecturer.phone,
                role: 'lecturer',
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
