import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { closePaymentModal, useFlutterwave } from 'flutterwave-react-v3';
import { useAuth } from '../contexts/AuthContext';
import { usePlatformDialog } from '../contexts/PlatformDialogContext';
import { getRedirectPath } from '../utils/authRedirect';

const useBookPurchase = ({ onPurchaseSuccess } = {}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, refreshProfile, addPurchasedBook } = useAuth();
  const { notify } = usePlatformDialog();
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
      const redirectPath = getRedirectPath(location);
      const loginPath = redirectPath
        ? `/login?redirect=${encodeURIComponent(redirectPath)}`
        : '/login';
      navigate(loginPath, { state: { from: location } });
      return;
    }

    if (!flwPublicKey) {
      notify({
        title: 'Payment not ready',
        message: 'Please try again in a moment.',
        variant: 'warning'
      });
      return;
    }

    if (!book?.price || book.price <= 0) {
      notify({
        title: 'Free book',
        message: 'This book is free and does not require payment.',
        variant: 'info'
      });
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
          notify({
            title: 'Payment failed',
            message: 'Your payment was not successful.',
            variant: 'error'
          });
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

          notify({
            title: 'Payment successful',
            message: 'You can now read this book.',
            variant: 'success'
          });
        } catch (error) {
          console.error('Payment verification failed:', error);
          notify({
            title: 'Verification failed',
            message: 'Payment verification failed. Please contact support.',
            variant: 'error'
          });
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
    onPurchaseSuccess,
    notify
  ]);

  return {
    checkoutBook,
    buyingBookId
  };
};

export default useBookPurchase;
