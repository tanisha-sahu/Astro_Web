const { Wishlist, Product } = require('../models');

// @desc    Get user wishlist
// @route   GET /api/v1/wishlist
// @access  Private
exports.getWishlist = async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user.id }).populate('products');

        if (!wishlist) {
            wishlist = await Wishlist.create({ user: req.user.id, products: [] });
        }

        res.status(200).json({
            success: true,
            count: wishlist.products.length,
            data: wishlist.products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Add/Remove product from wishlist (Toggle)
// @route   POST /api/v1/wishlist/toggle
// @access  Private
exports.toggleWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ success: false, message: 'Product ID is required' });
        }

        let wishlist = await Wishlist.findOne({ user: req.user.id });

        if (!wishlist) {
            wishlist = await Wishlist.create({ user: req.user.id, products: [] });
        }

        const isFavorite = wishlist.products.includes(productId);

        if (isFavorite) {
            // Remove
            wishlist.products = wishlist.products.filter(p => p.toString() !== productId);
        } else {
            // Add
            wishlist.products.push(productId);
        }

        await wishlist.save();

        res.status(200).json({
            success: true,
            isFavorite: !isFavorite,
            message: isFavorite ? 'Removed from favorites' : 'Added to favorites'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
