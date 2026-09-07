import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getBookCover, getOriginalBookPrice, isBuildWithAi } from '../../utils/bookUtils';
import {
  getBookDetailsPath,
  getBookEditPath,
  getBookReadPath
} from '../../utils/bookAccess';
import { useAuth } from '../../contexts/AuthContext';

const BookCard = ({
  book,
  isOwned = false,
  showDescription = true,
  showActions = true,
  showAdminActions = false,
  onRead,
  onBuy,
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
    navigate(getBookDetailsPath(book));
  };

  const handleRead = (e) => {
    if (e) e.stopPropagation();
    if (onRead) {
      onRead(book);
      return;
    }
    navigate(getBookReadPath(book));
  };

  const handleBuy = (e) => {
    e.stopPropagation();
    if (onBuy) {
      onBuy(book);
      return;
    }
    navigate(getBookDetailsPath(book));
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete(book._id);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(book);
      return;
    }
    navigate(getBookEditPath(book));
  };

  return (
    <article
      className={`pf-store-card ${className || ''}`}
      style={style}
      onClick={handleViewDetails}
    >
      <div
        className="pf-store-card-visual"
        style={{
          backgroundImage: `url(${getBookCover(book.title)})`,
          backgroundSize: 'cover',
          backgroundPosition: isBuildWithAi(book?.title) ? 'center top' : 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <span className="pf-store-card-genre">{book.genre || 'General'}</span>
        <div className="pf-store-card-price-wrap">
          <p className="pf-store-card-price-label">
            {book.price && book.price > 0
              ? originalPrice
                ? 'Launch offer price'
                : 'Available now'
              : 'Included'}
          </p>
          <div className="pf-store-card-price-row">
            {originalPrice && (
              <span className="pf-store-card-price-old">
                NGN {originalPrice.toLocaleString()}
              </span>
            )}
            <span className="pf-store-card-price">
              {book.price && book.price > 0 ? `NGN ${book.price.toLocaleString()}` : 'Free'}
            </span>
          </div>
        </div>
      </div>

      <div className="pf-store-card-body">
        <h4 className="pf-store-card-title">{book.title}</h4>

        <div className="pf-store-card-tags">
          <span className="pf-tag-gold-soft">Premium reading</span>
          {isOwned && <span className="pf-tag-gold-soft pf-tag-owned">Owned</span>}
        </div>

        {showDescription && (
          <p className="pf-store-card-description">
            {book.description || 'No description available.'}
          </p>
        )}

        {showActions && (
          <div className="pf-store-card-actions" onClick={(e) => e.stopPropagation()}>
            <div className="pf-store-card-actions-row">
              <button
                type="button"
                onClick={canRead ? handleRead : handleViewDetails}
                className="pf-btn pf-btn-primary pf-btn-sm"
              >
                {canRead ? 'Read' : 'View Book'}
              </button>

              {!canRead && (
                <button
                  type="button"
                  onClick={handleBuy}
                  disabled={buying}
                  className="pf-btn pf-btn-secondary pf-btn-sm"
                >
                  {buying ? 'Processing...' : 'Buy Now'}
                </button>
              )}
            </div>

            {showAdminActions && user?.role === 'admin' && (
              <div className="pf-store-card-admin">
                <button type="button" onClick={handleEdit} className="pf-btn pf-btn-secondary pf-btn-sm pf-btn-admin">
                  Edit
                </button>
                <button type="button" onClick={handleDelete} className="pf-btn pf-btn-secondary pf-btn-sm pf-btn-danger">
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
