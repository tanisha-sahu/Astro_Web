import React, { createContext, useContext, useState, useEffect } from 'react';
import { wishlistService } from '../services';
import useAuthStore from '../store/authStore';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuthStore();

    const fetchWishlist = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const data = await wishlistService.getWishlist();
            setWishlist(data.map(p => p._id));
            setLoading(false);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchWishlist();
        } else {
            setWishlist([]);
        }
    }, [user]);

    const toggleWishlist = async (productId) => {
        if (!user) {
            alert('Please login to add to favorites');
            return;
        }
        try {
            const data = await wishlistService.toggleWishlist(productId);
            if (data.isFavorite) {
                setWishlist([...wishlist, productId]);
            } else {
                setWishlist(wishlist.filter(id => id !== productId));
            }
            return data.isFavorite;
        } catch (error) {
            console.error('Error toggling wishlist:', error);
        }
    };

    const isFavorite = (productId) => {
        return wishlist.includes(productId);
    };

    return (
        <WishlistContext.Provider value={{ wishlist, loading, toggleWishlist, isFavorite, refreshWishlist: fetchWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};
