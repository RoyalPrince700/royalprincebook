import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import BookInsightDetails from '../components/Book/BookInsightDetails';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import useBookPurchase from '../hooks/useBookPurchase';

const BookInsightPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, isInCart, removeFromCart } = useCart();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { checkoutBook, buyingBookId } = useBookPurchase({
    onPurchaseSuccess: async (purchasedBook) => {
      removeFromCart(purchasedBook._id);
      navigate(`/books/${purchasedBook._id}/read`);
    }
  });

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await axios.get(`/books/details/${bookId}`);
        setBook(response.data.book || null);
      } catch (fetchError) {
        console.error('Failed to fetch book details:', fetchError);
        setError('Failed to load book details');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId]);

  const getIsOwned = (currentBook) => {
    if (!currentBook) return false;
    if (!user) return false;
    if (user.role === 'admin') return true;

    const purchasedBooks = Array.isArray(user.purchasedBooks) ? user.purchasedBooks : [];
    return purchasedBooks.includes(currentBook._id) || !currentBook.price || currentBook.price === 0;
  };

  const handleRead = () => {
    if (!book) return;
    navigate(`/books/${book._id}/read`);
  };

  const handleBuy = () => {
    if (!book) return;
    checkoutBook(book);
  };

  const handleAddToCart = () => {
    if (!book) return;
    addToCart(book);
  };

  return (
    <BookInsightDetails
      book={book}
      loading={loading}
      error={error}
      canRead={getIsOwned(book)}
      isInCart={book ? isInCart(book._id) : false}
      buying={buyingBookId === book?._id}
      onRead={handleRead}
      onBuy={handleBuy}
      onAddToCart={handleAddToCart}
    />
  );
};

export default BookInsightPage;
