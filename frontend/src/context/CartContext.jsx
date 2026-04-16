import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

export const CartProvider = ({ children }) => {
  // Use localStorage to persist the cart
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('sanatani_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('sanatani_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product) => {
    setItems(curr => {
      const existing = curr.find(item => item.id === product.id);
      if (existing) {
        return curr.map(item => 
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...curr, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setItems(curr => curr.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setItems(curr => curr.filter(item => item.id !== id));
  };

  const cartCount = items.reduce((acc, item) => acc + item.qty, 0);
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <CartContext.Provider value={{ items, addToCart, updateQty, removeItem, cartCount, subtotal }}>
      {children}
    </CartContext.Provider>
  );
};
