const mongoose = require('mongoose');
const Lecture = require('./Lecture');
const Quiz = require('./Quiz');
const Resource = require('./Resource');
const User = require('./User');
const { USER_LEVELS } = require('../utils/aiUtils'); // Ensure USER_LEVELS is defined properly

mongoose.connect('mongodb+srv://Billooko:Bill2020$2019@cluster0.5bdq7lh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const seedData = async () => {
    try {
        const userId = '671052a47d12a3bc2371574d';

        // Clear existing data to avoid duplicates
        await Lecture.deleteMany({});
        await Quiz.deleteMany({});
        await Resource.deleteMany({});
        await User.deleteMany({ _id: userId });

        const user = await User.create({
            _id: userId,
            username: 'sampleUser',
            email: 'sampleUser@example.com',
            password: 'samplePassword123!',
            userLevel: USER_LEVELS.UNIVERSITY, // Use a valid userLevel
        });

        await Lecture.create({
            title: 'Sample Lecture',
            description: 'This is a sample lecture description.',
            scheduledTime: new Date(),
            duration: 60,
            lecturer: userId,
            attendees: [userId],
            isAR: true,
            isVR: false,
            type: 'Live',
            createdBy: userId
        });

        await Quiz.create({
            title: 'Sample Quiz',
            participants: [userId],
            isARVRQuiz: true,
            createdBy: userId,
            subject: 'Math',
            questions: [],
            passingScore: 70
        });

        await Resource.create({
            title: 'Sample Resource',
            description: 'This is a sample resource description.',
            url: 'http://example.com',
            type: 'video',
            format: 'MP4',
            subjects: ['math'],
            isAR: true,
            createdBy: userId,
            accessibility: { languages: ['en'], subtitles: true },
            isExternal: false,
            status: 'available'
        });

        console.log('Data seeded successfully');
        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding data:', error);
        mongoose.connection.close();
    }
};

seedData();
