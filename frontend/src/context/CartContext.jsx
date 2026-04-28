import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import useAuthStore from '../store/authStore';
import { cartService } from '../services';


const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('sanatani_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const prevAuthRef = useRef(isAuthenticated);



  const syncWithBackend = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const backendCart = await cartService.fetchCart();
      setItems(backendCart.items);
    } catch (error) {
      console.error('Failed to fetch cart from backend:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);


  // Handle Login/Logout sync
  useEffect(() => {
    if (isAuthenticated && !prevAuthRef.current) {
      // Just logged in - merge guest cart
      const guestCart = JSON.parse(localStorage.getItem('sanatani_cart') || '[]');
      const mergeCart = async () => {
        try {
          if (guestCart.length > 0) {
            for (const item of guestCart) {
              await cartService.addToCart(item.id, item.qty);
            }
            localStorage.removeItem('sanatani_cart');
          }
          await syncWithBackend();
        } catch (error) {
          console.error('Error merging cart:', error);
        }
      };
      mergeCart();
    } else if (!isAuthenticated && prevAuthRef.current) {
      // Just logged out
      setItems([]);
      localStorage.removeItem('sanatani_cart');
    } else if (isAuthenticated) {
      // Already authenticated on mount
      syncWithBackend();
    }
    prevAuthRef.current = isAuthenticated;
  }, [isAuthenticated, syncWithBackend]);

  // Persist to localStorage only if GUEST
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('sanatani_cart', JSON.stringify(items));
    }
  }, [items, isAuthenticated]);

  const addToCart = async (product, qty = 1) => {
    const productId = product._id || product.id;
    
    if (isAuthenticated) {
      try {
        const updatedCart = await cartService.addToCart(productId, qty);
        if (updatedCart && updatedCart.items) {
          setItems(updatedCart.items);
          return true;
        }
        return false;
      } catch (error) {
        console.error('Failed to add to cart:', error);
        return false;
      }
    } else {
      try {
        setItems(curr => {
          const existing = curr.find(item => item.id === productId);
          if (existing) {
            return curr.map(item => 
              item.id === productId ? { ...item, qty: item.qty + qty } : item
            );
          }
          return [...curr, { 
              id: productId, 
              name: product.name, 
              price: product.sellingPrice || product.price, 
              img: product.image || product.img,
              category: product.category || (product.collection?.name),
              qty: qty 
          }];
        });
        return true;
      } catch (error) {
        console.error('Failed to add to guest cart:', error);
        return false;
      }
    }
  };

  const updateQty = async (id, delta) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    const newQty = Math.max(1, item.qty + delta);

    if (isAuthenticated) {
      try {
        const updatedCart = await cartService.updateCartItem(id, newQty);
        setItems(updatedCart.items);
      } catch (error) {
        console.error('Failed to update cart qty:', error);
      }
    } else {
      setItems(curr => curr.map(item => {
        if (item.id === id) {
          return { ...item, qty: newQty };
        }
        return item;
      }));
    }
  };

  const removeItem = async (id) => {
    if (isAuthenticated) {
      try {
        const updatedCart = await cartService.removeFromCart(id);
        setItems(updatedCart.items);
      } catch (error) {
        console.error('Failed to remove from cart:', error);
      }
    } else {
      setItems(curr => curr.filter(item => item.id !== id));
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await cartService.clearCart();
        setItems([]);
      } catch (error) {
        console.error('Failed to clear cart:', error);
      }
    } else {
      setItems([]);
      localStorage.removeItem('sanatani_cart');
    }
  };

  const cartCount = items.reduce((acc, item) => acc + item.qty, 0);
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <CartContext.Provider value={{ 
      items, 
      addToCart, 
      updateQty, 
      removeItem, 
      clearCart,
      cartCount, 
      subtotal, 
      loading 
    }}>
      {children}
    </CartContext.Provider>
  );
};
