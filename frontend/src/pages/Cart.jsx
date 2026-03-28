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
    <div className="min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      <section className="relative px-4 pb-12 pt-20 sm:px-6 md:pt-28 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.96),rgba(241,245,249,0.92)_45%,rgba(226,232,240,0.7)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-80 bg-linear-to-b from-white via-white/80 to-transparent" />
        <div className="absolute left-1/2 top-32 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-200/25 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="text-center">
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-600 shadow-sm backdrop-blur">
              Your Cart
            </span>
            <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-6xl">
              Review your order with clarity.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Select a book, confirm the total, and move to checkout in a calmer, more focused layout.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-3">
            <div className="rounded-4xl border border-white/70 bg-white/75 p-6 shadow-sm backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Items</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{itemCount}</p>
            </div>
            <div className="rounded-4xl border border-white/70 bg-white/75 p-6 shadow-sm backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Cart Total</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                NGN {totalPrice.toLocaleString()}
              </p>
            </div>
            <div className="rounded-4xl border border-white/70 bg-white/75 p-6 shadow-sm backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Checkout</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Secure payment is processed only for the book you select.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/all-books"
              className="inline-flex min-w-40 items-center justify-center rounded-full bg-slate-950 px-8 py-3 text-sm font-medium transition hover:bg-slate-800"
              style={{ color: 'white' }}
            >
              Continue Shopping
            </Link>
            {cartItems.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="inline-flex min-w-40 items-center justify-center rounded-full border border-slate-300 bg-white/80 px-8 py-3 text-sm font-medium text-slate-800 transition hover:border-slate-400 hover:bg-white"
              >
                Clear Cart
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {cartItems.length === 0 ? (
            <div className="rounded-4xl border border-white/70 bg-white/80 px-6 py-16 text-center shadow-xl backdrop-blur">
              <h3 className="text-2xl font-semibold tracking-tight text-slate-950">Your cart is empty</h3>
              <p className="mt-3 text-slate-600">
                Add a book from the collection to see it here.
              </p>
              <Link
                to="/all-books"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
                style={{ color: 'white' }}>
                Browse Books
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1.5fr_0.9fr] lg:items-start">
              <section className="rounded-4xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur">
                <div className="mb-6 flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Cart Items
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                      Choose what to checkout
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                      Pick one title below and the summary updates instantly.
                    </p>
                  </div>
                  <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
                    Total: NGN {totalPrice.toLocaleString()}
                  </div>
                </div>

                <div className="space-y-4">
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

              <aside className="lg:sticky lg:top-28">
                <div className="rounded-4xl border border-white/70 bg-white/85 p-6 shadow-xl backdrop-blur">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Order Summary
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                    Ready when you are
                  </h2>

                  <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Selected book
                    </p>
                    <strong className="mt-2 block text-lg font-semibold text-slate-950">
                      {selectedBook?.title || 'Choose a book'}
                    </strong>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span>Subtotal</span>
                      <strong className="text-slate-950">NGN {subtotal.toLocaleString()}</strong>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span>Service fee</span>
                      <strong className="text-slate-950">NGN {serviceFee.toLocaleString()}</strong>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-base font-semibold text-slate-950">
                      <span>Total</span>
                      <strong>NGN {orderTotal.toLocaleString()}</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={handleCheckout}
                    disabled={!selectedBook || buyingBookId === selectedBook?._id}
                  >
                    {buyingBookId === selectedBook?._id
                      ? 'Processing...'
                      : getIsOwned(selectedBook) || !selectedBook?.price
                        ? 'Open Book'
                        : 'Checkout'}
                  </button>

                  <p className="mt-4 text-sm leading-relaxed text-slate-500">
                    Secure payment is processed during checkout for the selected book.
                  </p>
                </div>
              </aside>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Cart;
