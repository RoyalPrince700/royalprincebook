import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { closePaymentModal, useFlutterwave } from 'flutterwave-react-v3';
import { useAuth } from '../contexts/AuthContext';
import { usePlatformDialog } from '../contexts/PlatformDialogContext';
import { getRedirectPath } from '../utils/authRedirect';
import { buildLoginPath } from '../utils/requireAuth';
import { getPostPurchaseLocation, isBuildWithAiBook } from '../utils/bookAccess';

const useBookPurchase = ({ onPurchaseSuccess } = {}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, refreshProfile, syncPurchasedBooks } = useAuth();
  const { notify } = usePlatformDialog();
  const [selectedBook, setSelectedBook] = useState(null);
  const [buyingBookId, setBuyingBookId] = useState(null);
  const [flwPublicKey, setFlwPublicKey] = useState('');
  const paymentHandledRef = useRef(false);
  const checkoutInitiatedRef = useRef(false);
  const onPurchaseSuccessRef = useRef(onPurchaseSuccess);
  const notifyRef = useRef(notify);
  const refreshProfileRef = useRef(refreshProfile);
  const syncPurchasedBooksRef = useRef(syncPurchasedBooks);

  useEffect(() => {
    onPurchaseSuccessRef.current = onPurchaseSuccess;
    notifyRef.current = notify;
    refreshProfileRef.current = refreshProfile;
    syncPurchasedBooksRef.current = syncPurchasedBooks;
  }, [onPurchaseSuccess, notify, refreshProfile, syncPurchasedBooks]);

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
      meta: {
        bookId: selectedBook?.apiBookId || selectedBook?._id || '',
        userId: user?.id || user?._id || ''
      },
      customizations: {
        title: selectedBook ? `Purchase ${selectedBook.title}` : 'Purchase Book',
        description: 'Payment for book access'
      }
    }),
    [flwPublicKey, selectedBook, user]
  );

  const triggerFlutterwavePayment = useFlutterwave(paymentConfig);
  const triggerFlutterwavePaymentRef = useRef(triggerFlutterwavePayment);

  useEffect(() => {
    triggerFlutterwavePaymentRef.current = triggerFlutterwavePayment;
  }, [triggerFlutterwavePayment]);

  const resetCheckoutState = () => {
    checkoutInitiatedRef.current = false;
    setBuyingBookId(null);
    setSelectedBook(null);
  };

  useEffect(() => {
    if (!selectedBook || !buyingBookId) {
      checkoutInitiatedRef.current = false;
      return;
    }

    if (checkoutInitiatedRef.current) {
      return;
    }

    checkoutInitiatedRef.current = true;
    paymentHandledRef.current = false;

    const currentBook = selectedBook;

    triggerFlutterwavePaymentRef.current({
      callback: async (response) => {
        if (paymentHandledRef.current) {
          return;
        }
        paymentHandledRef.current = true;

        closePaymentModal();

        if (!['successful', 'success', 'completed'].includes(String(response.status || '').toLowerCase())) {
          resetCheckoutState();
          notifyRef.current({
            title: 'Payment failed',
            message: 'Your payment was not successful.',
            variant: 'error'
          });
          return;
        }

        try {
          const verifyResponse = await axios.post('/payment/verify', {
            transaction_id: response.transaction_id || response.id,
            bookId: currentBook.apiBookId || currentBook._id
          });

          if (Array.isArray(verifyResponse.data?.purchasedBooks)) {
            syncPurchasedBooksRef.current(verifyResponse.data.purchasedBooks);
          } else {
            await refreshProfileRef.current();
          }

          if (onPurchaseSuccessRef.current) {
            await onPurchaseSuccessRef.current(currentBook);
          } else {
            navigate(getPostPurchaseLocation(currentBook));
          }

          notifyRef.current(
            isBuildWithAiBook(currentBook)
              ? {
                  title: 'You are in',
                  message: 'Your workshop kit is ready — WhatsApp, event, recordings, and the book.',
                  variant: 'success'
                }
              : {
                  title: 'Payment successful',
                  message: 'You can now read this book.',
                  variant: 'success'
                }
          );
        } catch (error) {
          console.error('Payment verification failed:', error);
          notifyRef.current({
            title: 'Verification failed',
            message: 'Payment verification failed. Please contact support.',
            variant: 'error'
          });
        } finally {
          resetCheckoutState();
        }
      },
      onClose: () => {
        if (!paymentHandledRef.current) {
          resetCheckoutState();
        }
      }
    });
  }, [selectedBook, buyingBookId]);

  const checkoutBook = (book) => {
    if (!user) {
      navigate(buildLoginPath(getRedirectPath(location)), { state: { from: location } });
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

    if (buyingBookId) {
      return;
    }

    setSelectedBook(book);
    setBuyingBookId(book.apiBookId || book._id);
  };

  return {
    checkoutBook,
    buyingBookId
  };
};

export default useBookPurchase;
