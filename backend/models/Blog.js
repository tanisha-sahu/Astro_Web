const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Blog title is required'],
        trim: true
    },
    excerpt: {
        type: String,
        required: [true, 'Blog excerpt is required'],
        trim: true
    },
    content: {
        type: String,
        required: [true, 'Blog content is required']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Vedas', 'Jyotish', 'Mythology', 'Spirituality', 'Chronicles', 'Other'],
        default: 'Other'
    },
    image: {
        type: String,
        required: [true, 'Blog featured image is required']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    readingTime: {
        type: String,
        default: '5 min read'
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    slug: {
        type: String,
        unique: true
    }
}, {
    timestamps: true
});

// Create slug from title before saving
blogSchema.pre('save', async function() {
    if (this.isModified('title')) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
    }
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
