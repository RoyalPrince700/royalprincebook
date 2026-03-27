import React from 'react';
import { getBookCover } from '../../utils/bookUtils';

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
  return (
    <article className={`cart-item-card ${isSelected ? 'selected' : ''}`}>
      <button
        type="button"
        className="cart-item-select"
        onClick={() => onSelect(book)}
        aria-pressed={isSelected}
      >
        <span className={`cart-item-radio ${isSelected ? 'active' : ''}`} />
      </button>

      <div className="cart-item-cover-wrap">
        <img
          src={getBookCover(book.title)}
          alt={book.title}
          className="cart-item-cover"
        />
      </div>

      <div className="cart-item-content">
        <div className="cart-item-main">
          <div>
            <h3 className="cart-item-title">{book.title}</h3>
          </div>

          <div className="cart-item-price-block">
            <p className="cart-item-label">Price</p>
            <p className="cart-item-price">
              {book.price && book.price > 0 ? `₦${book.price.toLocaleString()}` : 'Free'}
            </p>
          </div>
        </div>

        <div className="cart-item-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => onRemove(book._id)}
          >
            Remove
          </button>

          {isOwned ? (
            <button
              type="button"
              className="btn-primary"
              onClick={() => onRead(book)}
            >
              Read Book
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary"
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
