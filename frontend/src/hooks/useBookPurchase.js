import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { closePaymentModal, useFlutterwave } from 'flutterwave-react-v3';
import { useAuth } from '../contexts/AuthContext';

const useBookPurchase = ({ onPurchaseSuccess } = {}) => {
  const navigate = useNavigate();
  const { user, refreshProfile, addPurchasedBook } = useAuth();
  const [selectedBook, setSelectedBook] = useState(null);
  const [buyingBookId, setBuyingBookId] = useState(null);
  const [flwPublicKey, setFlwPublicKey] = useState('');

  useEffect(() => {
    const fetchPublicKey = async () => {
      try {
        const response = await axios.get('/config/flutterwave-public-key');
        setFlwPublicKey(response.data.publicKey || '');
      } catch (error) {
        console.error('Failed to fetch Flutterwave public key:', error);
      }
    };

    fetchPublicKey();
  }, []);

  const paymentConfig = useMemo(
    () => ({
      public_key: flwPublicKey || 'FLW_PUBLIC_KEY',
      tx_ref: `${Date.now()}-${selectedBook?._id || 'book'}`,
      amount: selectedBook?.price || 0,
      currency: 'NGN',
      payment_options: 'card,mobilemoney,ussd',
      customer: {
        email: user?.email || '',
        name: user?.username || ''
      },
      customizations: {
        title: selectedBook ? `Purchase ${selectedBook.title}` : 'Purchase Book',
        description: 'Payment for book access'
      }
    }),
    [flwPublicKey, selectedBook, user]
  );

  const triggerFlutterwavePayment = useFlutterwave(paymentConfig);

  const checkoutBook = (book) => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!flwPublicKey) {
      alert('Payment is not ready yet. Please try again in a moment.');
      return;
    }

    if (!book?.price || book.price <= 0) {
      alert('This book is free and does not require payment.');
      return;
    }

    setSelectedBook(book);
    setBuyingBookId(book._id);
  };

  useEffect(() => {
    if (!selectedBook || !buyingBookId) return;

    const currentBook = selectedBook;

    triggerFlutterwavePayment({
      callback: async (response) => {
        closePaymentModal();

        if (response.status !== 'successful') {
          setBuyingBookId(null);
          setSelectedBook(null);
          alert('Payment was not successful.');
          return;
        }

        try {
          await axios.post('/payment/verify', {
            transaction_id: response.transaction_id,
            bookId: currentBook._id
          });

          addPurchasedBook(currentBook._id);
          await refreshProfile();

          if (onPurchaseSuccess) {
            await onPurchaseSuccess(currentBook);
          }

          alert('Payment successful. You can now read this book.');
        } catch (error) {
          console.error('Payment verification failed:', error);
          alert('Payment verification failed. Please contact support.');
        } finally {
          setBuyingBookId(null);
          setSelectedBook(null);
        }
      },
      onClose: () => {
        setBuyingBookId(null);
        setSelectedBook(null);
      }
    });
  }, [
    selectedBook,
    buyingBookId,
    triggerFlutterwavePayment,
    refreshProfile,
    addPurchasedBook,
    onPurchaseSuccess
  ]);

  return {
    checkoutBook,
    buyingBookId
  };
};

export default useBookPurchase;
