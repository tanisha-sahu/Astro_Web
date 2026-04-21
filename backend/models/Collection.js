const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Collection name is required'],
        trim: true,
        unique: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    image: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Auto-generate slug from name if not provided
collectionSchema.pre('validate', function() {
    if (this.name && !this.slug) {
        this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
});

const Collection = mongoose.model('Collection', collectionSchema);

module.exports = Collection;
