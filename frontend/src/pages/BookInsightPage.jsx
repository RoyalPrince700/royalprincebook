import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import BookInsightDetails from '../components/Book/BookInsightDetails';
import { useAuth } from '../contexts/AuthContext';
import useBookPurchase from '../hooks/useBookPurchase';
import {
  getBookDetailsPath,
  getBookReadPath,
  getBookSlug,
  getPostPurchaseLocation,
  userHasBookAccess
} from '../utils/bookAccess';
import { resolveBookFromKey } from '../utils/bookSlugs';

const BookInsightPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { checkoutBook, buyingBookId } = useBookPurchase({
    onPurchaseSuccess: async (purchasedBook) => {
      navigate(getPostPurchaseLocation(purchasedBook));
    }
  });

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      setError('');

      try {
        const resolvedBook = await resolveBookFromKey(bookId, async (key) => {
          const response = await axios.get(`/books/details/${key}`);
          return response.data.book || null;
        });

        if (!resolvedBook) {
          setBook(null);
          setError('Failed to load book details');
          return;
        }

        setBook(resolvedBook);

        const canonicalSlug = getBookSlug(resolvedBook);
        if (canonicalSlug && bookId !== canonicalSlug) {
          navigate(getBookDetailsPath(resolvedBook), { replace: true });
        }
      } catch (fetchError) {
        console.error('Failed to fetch book details:', fetchError);
        setError('Failed to load book details');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId, navigate]);

  const getIsOwned = (currentBook) => userHasBookAccess(user, currentBook);

  const handleRead = () => {
    if (!book) return;
    navigate(getBookReadPath(book));
  };

  const handleBuy = () => {
    if (!book) return;
    checkoutBook(book);
  };

  const purchaseBookId = book?.apiBookId || book?._id;

  return (
    <BookInsightDetails
      book={book}
      loading={loading}
      error={error}
      canRead={getIsOwned(book)}
      buying={buyingBookId === purchaseBookId || buyingBookId === book?._id}
      onRead={handleRead}
      onBuy={handleBuy}
    />
  );
};

export default BookInsightPage;
