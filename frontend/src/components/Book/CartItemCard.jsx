import React from 'react';
import { getBookCover, getOriginalBookPrice } from '../../utils/bookUtils';

const CartItemCard = ({
  book,
  isSelected = false,
  isOwned = false,
  buying = false,
  onSelect,
  onCheckout,
  onRemove,
  onRead
}) => {
  const originalPrice = getOriginalBookPrice(book?.title, book?.price);

  return (
    <article
      className={`grid gap-4 rounded-4xl border p-4 transition duration-200 md:grid-cols-[auto_96px_1fr] md:items-center ${
        isSelected
          ? 'border-slate-900 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]'
          : 'border-white/70 bg-white/75 shadow-sm backdrop-blur hover:border-slate-200 hover:shadow-[0_16px_40px_rgba(15,23,42,0.06)]'
      }`}
    >
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center self-start rounded-full border border-slate-200 bg-white md:self-center"
        onClick={() => onSelect(book)}
        aria-pressed={isSelected}
      >
        <span
          className={`h-4 w-4 rounded-full border transition ${
            isSelected ? 'border-slate-900 bg-slate-900' : 'border-slate-300 bg-transparent'
          }`}
        />
      </button>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
        <img
          src={getBookCover(book.title)}
          alt={book.title}
          className="h-28 w-full object-cover md:h-32 md:w-24"
        />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Selected title
            </p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
              {book.title}
            </h3>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 md:min-w-36">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              {originalPrice ? 'Launch offer price' : 'Price'}
            </p>
            <div className="mt-1 flex flex-wrap items-baseline gap-2">
              {originalPrice && (
                <span className="text-sm font-medium text-slate-400 line-through">
                  NGN {originalPrice.toLocaleString()}
                </span>
              )}
              <p className="text-lg font-semibold text-slate-950">
                {book.price && book.price > 0 ? `NGN ${book.price.toLocaleString()}` : 'Free'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
            onClick={() => onRemove(book._id)}
          >
            Remove
          </button>

          {isOwned ? (
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
              onClick={() => onRead(book)}
            >
              Read Book
            </button>
          ) : (
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={() => onCheckout(book)}
              disabled={buying}
            >
              {buying ? 'Processing...' : 'Checkout'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default CartItemCard;
