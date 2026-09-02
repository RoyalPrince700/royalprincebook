import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import BookInsightDetails from '../components/Book/BookInsightDetails';
import { useAuth } from '../contexts/AuthContext';
import useBookPurchase from '../hooks/useBookPurchase';
import { getLocalBook, isLocalBookId } from '../utils/localBookService';
import { getReadBookId, userHasBookAccess } from '../utils/bookAccess';

const BookInsightPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { checkoutBook, buyingBookId } = useBookPurchase({
    onPurchaseSuccess: async (purchasedBook) => {
      navigate(`/books/${getReadBookId(purchasedBook)}/read`);
    }
  });

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      setError('');

      try {
        if (isLocalBookId(bookId)) {
          setBook(getLocalBook(bookId));
          return;
        }

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

  const getIsOwned = (currentBook) => userHasBookAccess(user, currentBook);

  const handleRead = () => {
    if (!book) return;
    navigate(`/books/${getReadBookId(book)}/read`);
  };

  const handleBuy = () => {
    if (!book) return;
    checkoutBook(book);
  };

  return (
    <BookInsightDetails
      book={book}
      loading={loading}
      error={error}
      canRead={getIsOwned(book)}
      buying={buyingBookId === book?._id}
      onRead={handleRead}
      onBuy={handleBuy}
    />
  );
};

export default BookInsightPage;
