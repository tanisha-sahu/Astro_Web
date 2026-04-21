const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    shortDescription: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Main description is required']
    },
    mrp: {
        type: Number,
        required: [true, 'MRP is required'],
        min: 0
    },
    sellingPrice: {
        type: Number,
        required: [true, 'Selling price is required'],
        min: 0
    },
    collection: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collection',
        required: [true, 'Collection is required']
    },
    image: {
        type: String,
        required: [true, 'Product image is required']
    },
    stock: {
        type: Number,
        default: 0
    },
    specifications: [{
        label: { type: String, trim: true },
        value: { type: String, trim: true }
    }],
    careInstructions: [{
        type: String,
        trim: true
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Auto-generate slug from name
productSchema.pre('validate', function() {
    if (this.name && !this.slug) {
        this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
