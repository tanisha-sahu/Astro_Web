const mongoose = require('mongoose');
const Blog = require('../models/Blog');
const User = require('../models/User');
require('dotenv').config();

const blogs = [
    {
        title: "Understanding the Power of Rudraksha",
        excerpt: "Discover the spiritual and health benefits of wearing sacred Rudraksha beads and how to choose the right one for you.",
        content: "<p>The Rudraksha bead is a seed traditionally used as a prayer bead in Hinduism. It is associated with Lord Shiva and is believed to possess divine powers. In this article, we explore the different mukhis (faces) of Rudraksha and their unique cosmic vibrations...</p><h3>The Science of Rudraksha</h3><p>Beyond spiritual belief, modern science has observed that Rudraksha beads have electromagnetic properties that can help stabilize heart rate and blood pressure when worn against the skin...</p>",
        category: "Spirituality",
        image: "/uploads/rudraksh.png",
        readingTime: "6 min read",
        isPublished: true
    },
    {
        title: "The Significance of Diya in Vedic Rituals",
        excerpt: "Why do we light a lamp? Explore the profound symbolism of the Diya and its role in connecting us to the divine light.",
        content: "<p>In every Hindu household, the day begins and ends with the lighting of a Diya. But it's more than just a tradition. The flame of the Diya represents knowledge, which dispels the darkness of ignorance...</p><blockquote>'Tamso Ma Jyotirgamaya' - Lead me from darkness to light.</blockquote>",
        category: "Mythology",
        image: "/uploads/diya.png",
        readingTime: "4 min read",
        isPublished: true
    },
    {
        title: "Vedic Astrology: A Beginner's Guide",
        excerpt: "Learn the basics of Jyotish Shastra and how the planetary alignments at your birth influence your life's path.",
        content: "<p>Jyotish, often called 'The Eye of the Vedas', is the ancient Indian science of astrology. Unlike Western astrology, it is based on the sidereal zodiac and focuses heavily on the moon sign and nakshatras...</p>",
        category: "Jyotish",
        image: "/uploads/image-1776791163177-911353448.png",
        readingTime: "8 min read",
        isPublished: true
    },
    {
        title: "Sacred Rivers of India: The Story of Ganga",
        excerpt: "Explore the celestial descent of Mother Ganga and why her waters are considered the nectar of immortality.",
        content: "<p>The Ganges is not just a river; she is a mother and a goddess. The Puranas tell the story of Bhagiratha's intense penance to bring the celestial river down to Earth to purify the souls of his ancestors...</p>",
        category: "Vedas",
        image: "/uploads/gangajal.png",
        readingTime: "7 min read",
        isPublished: true
    },
    {
        title: "Modern Mindfulness through Ancient Wisdom",
        excerpt: "How to apply Vedic principles to manage stress and find inner peace in today's fast-paced digital world.",
        content: "<p>In an era of constant notifications and digital noise, the ancient wisdom of the Vedas offers a sanctuary of peace. Through Pratyahara (withdrawal of senses) and Dhyana (meditation), we can reclaim our focus...</p>",
        category: "Spirituality",
        image: "/uploads/incense.png",
        readingTime: "5 min read",
        isPublished: true
    }
];

const seedBlogs = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find an admin user to be the author
        const admin = await User.findOne({ roles: 'admin' });
        if (!admin) {
            console.error('No admin user found to assign as author. Please create an admin first.');
            process.exit(1);
        }

        for (const blogData of blogs) {
            const blogExists = await Blog.findOne({ title: blogData.title });
            if (!blogExists) {
                await Blog.create({
                    ...blogData,
                    author: admin._id
                });
                console.log(`Created blog: ${blogData.title}`);
            } else {
                console.log(`Blog already exists: ${blogData.title}`);
            }
        }

        console.log('Seeding completed successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding blogs:', error);
        process.exit(1);
    }
};

seedBlogs();
