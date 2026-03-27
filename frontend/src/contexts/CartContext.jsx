import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();
const CART_STORAGE_KEY = 'book-cart-items';
const PRELAUNCH_BOOK_MATCHERS = ['leading from within', 'leadership from within'];
const PRELAUNCH_PRICE = 1000;

const getEffectivePrice = (book) => {
  const title = (book?.title || '').toLowerCase();
  const isPrelaunchBook = PRELAUNCH_BOOK_MATCHERS.some((matcher) => title.includes(matcher));
  return isPrelaunchBook ? PRELAUNCH_PRICE : book?.price || 0;
};

const getStoredCart = () => {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    const parsedCart = storedCart ? JSON.parse(storedCart) : [];
    return Array.isArray(parsedCart) ? parsedCart.map(normalizeBook) : [];
  } catch (error) {
    console.error('Failed to load cart from storage:', error);
    return [];
  }
};

const normalizeBook = (book) => ({
  _id: book._id,
  title: book.title,
  description: book.description,
  genre: book.genre,
  price: getEffectivePrice(book)
});

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState(getStoredCart);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error('Failed to save cart to storage:', error);
    }
  }, [cartItems]);

  useEffect(() => {
    const purchasedBooks = Array.isArray(user?.purchasedBooks) ? user.purchasedBooks : [];
    if (purchasedBooks.length === 0) return;

    setCartItems((prevItems) =>
      prevItems.filter((item) => !purchasedBooks.includes(item._id))
    );
  }, [user]);

  const addToCart = (book) => {
    if (!book?._id) return false;

    let wasAdded = false;

    setCartItems((prevItems) => {
      if (prevItems.some((item) => item._id === book._id)) {
        return prevItems;
      }

      wasAdded = true;
      return [...prevItems, normalizeBook(book)];
    });

    return wasAdded;
  };

  const removeFromCart = (bookId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== bookId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const isInCart = (bookId) => cartItems.some((item) => item._id === bookId);

  const totalPrice = useMemo(
    () => cartItems.reduce((total, item) => total + (item.price || 0), 0),
    [cartItems]
  );

  const value = {
    cartItems,
    itemCount: cartItems.length,
    totalPrice,
    addToCart,
    removeFromCart,
    clearCart,
    isInCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
