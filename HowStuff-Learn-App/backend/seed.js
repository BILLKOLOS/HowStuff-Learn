const mongoose = require('mongoose');
const Lecture = require('./Lecture'); // Adjust the path if needed
const Quiz = require('./Quiz'); // Adjust the path if needed
const Resource = require('./Resource'); // Adjust the path if needed
const User = require('./User'); // Adjust the path if needed
const Gamification = require('./Gamification'); // Adjust the path if needed
const Activity = require('./Activity'); // Adjust the path if needed
const Notification = require('./Notification'); // Adjust the path if needed
const { USER_LEVELS } = require('../utils/aiUtils'); // Assuming USER_LEVELS is defined properly

// MongoDB connection string
const mongoUri = 'mongodb+srv://Billooko:Bill2020$2019@cluster0.5bdq7lh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected');
    seedData();  // Call the seed function after connection
}).catch(err => console.error('MongoDB connection error:', err));

const seedData = async () => {
    try {
        // Clear existing data to avoid duplicates
        await Lecture.deleteMany({});
        await Quiz.deleteMany({});
        await Resource.deleteMany({});
        await User.deleteMany({});
        await Gamification.deleteMany({});
        await Activity.deleteMany({});
        await Notification.deleteMany({});

        // Sample user data
        const userData = {
            username: 'Ramiuoawwe',
            email: 'sdiqyuww8r@example.com',
            password: 'RamttawqdwPassword123!',  // Ideally, this should be hashed
            userLevel: USER_LEVELS.UNIVERSITY,  // Use a valid userLevel constant
            preferences: {
                learningPreferences: ['Math', 'Science']
            }
        };

        // Create temporary user
        const tempUserData = {
            username: 'TempUser',
            email: 'tempuser@example.com',
            password: 'TempUserPassword123!',  // Ideally, this should be hashed
            userLevel: USER_LEVELS.UNIVERSITY,  // Use a valid userLevel constant
            preferences: {
                learningPreferences: ['History', 'Geography']
            }
        };

        // Check for existing user
        const existingUser = await User.findOne({ username: userData.username });
        let userId;

        if (!existingUser) {
            // Create sample user
            const user = await User.create(userData);
            userId = user._id;
        } else {
            console.log(`User with username "${userData.username}" already exists.`);
            userId = existingUser._id; // Use existing user's ID
        }

        // Create temporary user if it doesn't exist
        const existingTempUser = await User.findOne({ username: tempUserData.username });
        let tempUserId;

        if (!existingTempUser) {
            // Create temporary user
            const tempUser = await User.create(tempUserData);
            tempUserId = tempUser._id;
            console.log('Temporary user created successfully:', tempUser);
        } else {
            console.log(`Temporary user with username "${tempUserData.username}" already exists.`);
            tempUserId = existingTempUser._id; // Use existing temporary user's ID
        }

        // Create sample AR/VR lectures
        await Lecture.create([
            {
                title: 'Intro to Quantum Physics (AR)',
                description: 'This is a sample AR lecture on Quantum Physics.',
                scheduledTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
                duration: 60,
                lecturer: userId,
                attendees: [userId, tempUserId], // Include temporary user as an attendee
                isAR: true,
                isVR: false,
                type: 'Live',
                createdBy: userId
            },
            {
                title: 'Exploring Space Travel (VR)',
                description: 'This is a sample VR lecture on Space Travel.',
                scheduledTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
                duration: 90,
                lecturer: userId,
                attendees: [userId, tempUserId], // Include temporary user as an attendee
                isAR: false,
                isVR: true,
                type: 'Live',
                createdBy: userId
            }
        ]);

        // Create sample AR/VR quizzes
        await Quiz.create([
            {
                title: 'AR Quiz on Biology',
                participants: [userId, tempUserId], // Include temporary user as a participant
                isARVRQuiz: true,
                createdBy: userId,
                subject: 'Biology',
                questions: [], // Add questions if available
                passingScore: 70,
                createdAt: new Date()
            },
            {
                title: 'VR Quiz on Mathematics',
                participants: [userId, tempUserId], // Include temporary user as a participant
                isARVRQuiz: true,
                createdBy: userId,
                subject: 'Math',
                questions: [], // Add questions if available
                passingScore: 80,
                createdAt: new Date()
            }
        ]);

        // Create sample AR/VR resources
        await Resource.create([
            {
                title: 'Physics in AR: Explore Concepts Visually',
                description: 'An immersive AR experience for understanding physics concepts.',
                url: 'http://example.com/physics-ar',
                type: 'video',
                format: 'MP4',
                subjects: ['Physics'],
                isAR: true,
                isVR: false,
                createdBy: userId,
                accessibility: { languages: ['en'], subtitles: true },
                isExternal: false,
                status: 'available'
            },
            {
                title: 'Mathematical Models in VR',
                description: 'A VR learning resource focused on mathematical models.',
                url: 'http://example.com/math-vr',
                type: 'video',
                format: 'MP4',
                subjects: ['Math'],
                isAR: false,
                isVR: true,
                createdBy: userId,
                accessibility: { languages: ['en'], subtitles: true },
                isExternal: false,
                status: 'available'
            }
        ]);

        // Create sample gamification status with correct structure
        await Gamification.create({
            user: userId,
            achievements: [
                {
                    title: "First Steps",
                    description: "Awarded for completing the first module.",
                    points: 10,
                }
            ],
            badges: [
                {
                    title: "Beginner Explorer",
                    description: "Awarded for completing the first module.",
                }
            ],
            totalPoints: 100,
            level: 1,
            xp: 50,
            progress: [], // Initialize with an empty array or add predefined progress
            milestones: [], // Initialize with an empty array or add predefined milestones
            rewards: [], // Initialize with an empty array or add predefined rewards
            activityHistory: [] // Initialize with an empty array or add predefined activity history
        });

        // Create sample activities with required fields
        await Activity.create([
            {
                userId: userId,
                title: 'AR Lecture on Quantum Physics',
                createdBy: userId,
                type: 'group', // Change to valid enum value
                skillLevel: 'intermediate', // Change to valid enum value
                duration: 60, // Duration in minutes
                suggestedAgeGroup: '13+', // Change to valid enum value
                description: 'Attended AR lecture on Quantum Physics',
                createdAt: new Date()
            },
            {
                userId: userId,
                title: 'AR Quiz on Biology',
                createdBy: userId,
                type: 'individual', // Change to valid enum value
                skillLevel: 'beginner', // Change to valid enum value
                duration: 30, // Duration in minutes
                suggestedAgeGroup: '9-12', // Change to valid enum value
                description: 'Completed AR quiz on Biology',
                createdAt: new Date()
            },
            {
                userId: tempUserId,
                title: 'AR Lecture on Quantum Physics (Temporary User)',
                createdBy: tempUserId,
                type: 'group', // Change to valid enum value
                skillLevel: 'intermediate', // Change to valid enum value
                duration: 60, // Duration in minutes
                suggestedAgeGroup: '13+', // Change to valid enum value
                description: 'Attended AR lecture on Quantum Physics (Temporary User)',
                createdAt: new Date()
            },
            {
                userId: tempUserId,
                title: 'AR Quiz on Biology (Temporary User)',
                createdBy: tempUserId,
                type: 'individual', // Change to valid enum value
                skillLevel: 'beginner', // Change to valid enum value
                duration: 30, // Duration in minutes
                suggestedAgeGroup: '9-12', // Change to valid enum value
                description: 'Completed AR quiz on Biology (Temporary User)',
                createdAt: new Date()
            }
        ]);

        // Create sample notifications
        await Notification.create([
            {
                userId: userId,
                message: 'Upcoming AR lecture: Quantum Physics in 2 days',
                type: 'Assignment', // Use appropriate notification type
                read: false,
                createdAt: new Date()
                
            },
            {
                userId: userId,
                message: 'New quiz available: AR Quiz on Biology',
                type: 'Assignment', // Use appropriate notification type
                read: false,
                createdAt: new Date()
            },
            {
                userId: tempUserId,
                message: 'Welcome to the platform, TempUser!',
                type: 'Assignment', // Use appropriate notification type
                read: false,
                createdAt: new Date()
                
            }
        ]);

        console.log('Data seeded successfully!');
    } catch (err) {
        console.error('Error seeding data:', err);
    } finally {
        // Close the MongoDB connection
        mongoose.connection.close();
    }
};

