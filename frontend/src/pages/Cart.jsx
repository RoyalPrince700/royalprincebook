import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartItemCard from '../components/Book/CartItemCard';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import useBookPurchase from '../hooks/useBookPurchase';

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, itemCount, totalPrice, removeFromCart, clearCart } = useCart();
  const [selectedBookId, setSelectedBookId] = useState(null);

  const { checkoutBook, buyingBookId } = useBookPurchase({
    onPurchaseSuccess: async (book) => {
      removeFromCart(book._id);
    }
  });

  useEffect(() => {
    if (cartItems.length === 0) {
      setSelectedBookId(null);
      return;
    }

    const selectedStillExists = cartItems.some((book) => book._id === selectedBookId);
    if (!selectedStillExists) {
      setSelectedBookId(cartItems[0]._id);
    }
  }, [cartItems, selectedBookId]);

  const getIsOwned = (book) => {
    if (!book) return false;
    if (!user) return false;
    if (user.role === 'admin') return true;

    const purchasedBooks = Array.isArray(user.purchasedBooks) ? user.purchasedBooks : [];
    return purchasedBooks.includes(book._id) || !book.price || book.price === 0;
  };

  const handleReadBook = (book) => {
    navigate(`/books/${book._id}/read`);
  };

  const selectedBook = useMemo(
    () => cartItems.find((book) => book._id === selectedBookId) || null,
    [cartItems, selectedBookId]
  );

  const subtotal = selectedBook ? selectedBook.price || 0 : totalPrice;
  const serviceFee = 0;
  const orderTotal = subtotal + serviceFee;

  const handleCheckout = () => {
    if (!selectedBook) return;

    if (getIsOwned(selectedBook) || !selectedBook.price || selectedBook.price === 0) {
      handleReadBook(selectedBook);
      return;
    }

    checkoutBook(selectedBook);
  };

  return (
    <div className="cart-page">
      <div className="cart-shell">
        <header className="cart-header">
          <div>
            <p className="cart-badge">Your Cart</p>
            <h1 className="cart-title">Review your order before checkout</h1>
            <p className="cart-subtitle">
              {itemCount} {itemCount === 1 ? 'book' : 'books'} saved in your cart.
            </p>
          </div>

          <div className="cart-header-actions">
            <Link to="/all-books" style={{ textDecoration: 'none' }}>
              <button className="btn-secondary">Continue Shopping</button>
            </Link>
            {cartItems.length > 0 && (
              <button className="btn-secondary" onClick={clearCart}>
                Clear Cart
              </button>
            )}
          </div>
        </header>

        {cartItems.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
            <h3>Your cart is empty</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Add a book from the books page to see it here.
            </p>
            <Link to="/all-books" style={{ textDecoration: 'none' }}>
              <button className="btn-primary">Browse Books</button>
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            <section className="cart-items-panel">
              <div className="cart-section-head">
                <div>
                  <h2 className="cart-section-title">Cart Items</h2>
                  <p className="cart-section-copy">Select a book to checkout from the summary.</p>
                </div>
                <div className="cart-total-mini">Total: ₦{totalPrice.toLocaleString()}</div>
              </div>

              <div className="cart-items-list">
                {cartItems.map((book) => (
                  <CartItemCard
                    key={book._id}
                    book={book}
                    isSelected={selectedBookId === book._id}
                    isOwned={getIsOwned(book)}
                    buying={buyingBookId === book._id}
                    onSelect={(selected) => setSelectedBookId(selected._id)}
                    onCheckout={checkoutBook}
                    onRemove={removeFromCart}
                    onRead={handleReadBook}
                  />
                ))}
              </div>
            </section>

            <aside className="cart-summary-panel">
              <div className="cart-summary-card">
                <h2 className="cart-section-title">Order Summary</h2>

                <div className="cart-summary-selected">
                  <span className="cart-item-label">Selected book</span>
                  <strong className="cart-summary-book-title">
                    {selectedBook?.title || 'Choose a book'}
                  </strong>
                </div>

                <div className="cart-summary-line">
                  <span>Subtotal</span>
                  <strong>₦{subtotal.toLocaleString()}</strong>
                </div>
                <div className="cart-summary-line">
                  <span>Service fee</span>
                  <strong>₦{serviceFee.toLocaleString()}</strong>
                </div>
                <div className="cart-summary-line total">
                  <span>Total</span>
                  <strong>₦{orderTotal.toLocaleString()}</strong>
                </div>

                <button
                  type="button"
                  className="btn-primary cart-checkout-button"
                  onClick={handleCheckout}
                  disabled={!selectedBook || buyingBookId === selectedBook?._id}
                >
                  {buyingBookId === selectedBook?._id
                    ? 'Processing...'
                    : getIsOwned(selectedBook) || !selectedBook?.price
                      ? 'Open Book'
                      : 'Checkout'}
                </button>

                <p className="cart-summary-note">
                  Secure payment is processed during checkout for the selected book.
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
