const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const astrologers = [
    {
        firstName: 'Pandit',
        lastName: 'Siddharth',
        email: 'siddharth@astrosanatani.com',
        password: 'password123',
        mobile: '+91 98765 43210',
        dob: '1975-05-15',
        roles: ['astrologer'],
        image: '/uploads/astrologers/astro_1.png',
        specialty: 'Vedic Astrology',
        experience: '20+ Years'
    },
    {
        firstName: 'Acharya',
        lastName: 'Meera',
        email: 'meera@astrosanatani.com',
        password: 'password123',
        mobile: '+91 98765 43211',
        dob: '1982-08-22',
        roles: ['astrologer'],
        image: '/uploads/astrologers/astro_2.png',
        specialty: 'Numerology & Vastu',
        experience: '12+ Years'
    },
    {
        firstName: 'Shastri',
        lastName: 'Rohan',
        email: 'rohan@astrosanatani.com',
        password: 'password123',
        mobile: '+91 98765 43212',
        dob: '1990-11-05',
        roles: ['astrologer'],
        image: '/uploads/astrologers/astro_3.png',
        specialty: 'Gemology & Face Reading',
        experience: '8+ Years'
    },
    {
        firstName: 'Guruji',
        lastName: 'Alok',
        email: 'alok@astrosanatani.com',
        password: 'password123',
        mobile: '+91 98765 43213',
        dob: '1968-03-12',
        roles: ['astrologer'],
        image: '/uploads/astrologers/astro_4.png',
        specialty: 'Prashna Kundali',
        experience: '25+ Years'
    },
    {
        firstName: 'Maharishi',
        lastName: 'Ved',
        email: 'ved@astrosanatani.com',
        password: 'password123',
        mobile: '+91 98765 43214',
        dob: '1955-12-30',
        roles: ['astrologer'],
        image: '/uploads/astrologers/astro_5.png',
        specialty: 'Ancient Palmistry',
        experience: '40+ Years'
    }
];

const seedAstrologers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        for (const astro of astrologers) {
            // Find by email and update or create
            await User.findOneAndUpdate(
                { email: astro.email },
                astro,
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            console.log(`Synchronized astrologer: ${astro.firstName} ${astro.lastName}`);
        }

        console.log('Seeding completed successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding astrologers:', error);
        process.exit(1);
    }
};

seedAstrologers();
