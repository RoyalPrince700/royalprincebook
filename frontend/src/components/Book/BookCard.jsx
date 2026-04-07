import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getBookCover, getOriginalBookPrice } from '../../utils/bookUtils';
import { useAuth } from '../../contexts/AuthContext';

const BookCard = ({
  book,
  isOwned = false,
  isInCart = false,
  showDescription = true,
  showActions = true,
  showAdminActions = false,
  onRead,
  onBuy,
  onAddToCart,
  onRemoveFromCart,
  onEdit,
  onDelete,
  buying = false,
  style,
  className
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const canRead = isOwned || !book?.price || book.price === 0 || user?.role === 'admin';
  const originalPrice = getOriginalBookPrice(book?.title, book?.price);

  const handleViewDetails = (e) => {
    if (e) e.stopPropagation();
    navigate(`/books/${book._id}/details`);
  };

  const handleRead = (e) => {
    if (e) e.stopPropagation();
    if (onRead) {
      onRead(book);
      return;
    }
    navigate(`/books/${book._id}/read`);
  };

  const handleBuy = (e) => {
    e.stopPropagation();
    if (onBuy) {
      onBuy(book);
      return;
    }
    navigate(`/books/${book._id}/details`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete(book._id);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (onAddToCart) onAddToCart(book);
  };

  const handleRemoveFromCart = (e) => {
    e.stopPropagation();
    if (onRemoveFromCart) onRemoveFromCart(book._id);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(book);
      return;
    }
    navigate(`/books/${book._id}`);
  };

  return (
    <article
      className={`group relative flex h-full min-h-[480px] cursor-pointer flex-col overflow-hidden rounded-4xl border border-white/70 bg-white/75 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)] ${className || ''}`}
      style={style}
      onClick={handleViewDetails}
    >
      <div
        className="relative h-[320px] overflow-hidden rounded-t-4xl bg-slate-100"
        style={{
          backgroundImage: `url(${getBookCover(book.title)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/78 via-slate-950/18 to-transparent" />
        <div className="absolute left-4 top-4 rounded-full border border-white/25 bg-white/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
          {book.genre || 'General'}
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
                {book.price && book.price > 0 ? (originalPrice ? 'Launch offer price' : 'Available now') : 'Included'}
              </p>
              <div className="mt-1 flex flex-wrap items-baseline gap-2">
                {originalPrice && (
                  <span className="text-sm font-medium text-white/55 line-through">
                    NGN {originalPrice.toLocaleString()}
                  </span>
                )}
                <p className="text-2xl font-semibold tracking-tight text-white">
                  {book.price && book.price > 0 ? `NGN ${book.price.toLocaleString()}` : 'Free'}
                </p>
              </div>
            </div>
            <span className="hidden rounded-full border border-white/30 px-4 py-2 text-sm font-medium text-white backdrop-blur md:inline-flex">
              {canRead ? 'Read Now' : 'View Book'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h4
          className="text-xl font-semibold tracking-tight text-slate-950"
          style={{
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {book.title}
        </h4>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">
            Premium reading
          </span>
          {isOwned && (
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              Owned
            </span>
          )}
          {isInCart && !canRead && (
            <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              In cart
            </span>
          )}
        </div>

        {showDescription && (
          <p
            className="mt-4 flex-1 text-sm leading-relaxed text-slate-600"
            style={{
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {book.description || 'No description available.'}
          </p>
        )}

        {showActions && (
          <div className="mt-6 border-t border-slate-200 pt-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={canRead ? handleRead : handleViewDetails}
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                {canRead ? 'Read' : 'View Book'}
              </button>

              {!canRead && (
                <button
                  onClick={handleBuy}
                  disabled={buying}
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-800 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {buying ? 'Processing...' : 'Buy Now'}
                </button>
              )}

              {!canRead && onAddToCart && !isInCart && (
                <button
                  onClick={handleAddToCart}
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  Add to Cart
                </button>
              )}

              {onRemoveFromCart && (
                <button
                  onClick={handleRemoveFromCart}
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  Remove
                </button>
              )}
            </div>

            {showAdminActions && user?.role === 'admin' && (
              <div className="mt-4 flex gap-2">
                <button
                  onClick={handleEdit}
                  title="Edit Book"
                  className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  title="Delete Book"
                  className="inline-flex items-center justify-center rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

export default BookCard;
