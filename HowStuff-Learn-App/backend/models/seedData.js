const mongoose = require('mongoose');
const Lecture = require('./Lecture');
const Quiz = require('./Quiz');
const Resource = require('./Resource');
const User = require('./User'); // Ensure User model is correctly imported

mongoose.connect('mongodb+srv://Billooko:Bill2020$2019@cluster0.5bdq7lh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const seedData = async () => {
    try {
        const user = await User.create({
            username: 'beb',
            email: 'sampleUser1@example.com',
            password: 'samplePassword123!',
            userLevel: 'university',
        });

        await Lecture.create({
            title: 'Sample Lecture',
            description: 'This is a sample lecture description.',
            scheduledTime: new Date(),
            duration: 60,
            lecturer: user._id,
            attendees: [],
            isAR: true,
            isVR: false,
            type: 'Live', // Ensure this matches your schema's enum
            createdBy: user._id
        });

        await Quiz.create({
            title: 'Sample Quiz',
            participants: [],
            isARVRQuiz: true,
            createdBy: user._id,
            subject: 'Math',
            questions: [],
            passingScore: 70
        });

        await Resource.create({
            title: 'Sample Resource',
            subjects: ['math'],
            isAR: true,
            link: 'http://example.com',
            createdBy: user._id
        });

        console.log('Data seeded successfully');
        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding data:', error);
        mongoose.connection.close();
    }
};

seedData();
