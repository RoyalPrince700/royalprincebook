import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getBookCover } from '../../utils/bookUtils';
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
    if (!user) {
      navigate('/login');
      return;
    }
    if (onBuy) {
      onBuy(book);
      return;
    }
    navigate(`/books/${book._id}/read`);
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
    <div 
      className={`book-card ${className || ''}`}
      style={{
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        backgroundColor: 'var(--card-bg)',
        overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: '450px',
        cursor: 'pointer',
        position: 'relative',
        ...style
      }}
      onClick={handleRead}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 10px 15px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
      }}
    >
      <div style={{
        width: '100%',
        height: '300px',
        backgroundColor: 'var(--input-bg)',
        backgroundImage: `url(${getBookCover(book.title)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderBottom: '1px solid var(--border-color)',
        position: 'relative',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="book-hover-overlay" style={{
             position: 'absolute',
             top: 0,
             left: 0,
             width: '100%',
             height: '100%',
             backgroundColor: 'rgba(0,0,0,0.5)',
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center',
             opacity: 0,
             transition: 'opacity 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
        onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
        >
             <span style={{
                 color: 'white',
                 fontWeight: 'bold',
                 fontSize: '1.2rem',
                 padding: '0.5rem 1rem',
                 border: '2px solid white',
                 borderRadius: '4px'
             }}>
                 {canRead ? 'Read Now' : 'View Book'}
             </span>
        </div>
      </div>

      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h4 style={{ 
          margin: '0 0 0.5rem 0', 
          color: 'var(--text-primary)',
          fontSize: '1.1rem',
          lineHeight: '1.4',
          height: '2.8em', // Limit to 2 lines approximately
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {book.title}
        </h4>
        
        <div style={{ 
          fontSize: '0.85rem', 
          color: 'var(--text-secondary)', 
          marginBottom: '1rem',
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap'
        }}>
          <span style={{ 
            backgroundColor: 'var(--bg-color)', 
            padding: '0.2rem 0.5rem', 
            borderRadius: '4px',
            color: 'var(--text-secondary)'
          }}>
            {book.genre || 'General'}
          </span>
        </div>

        {showDescription && (
          <p style={{ 
            margin: '0 0 1rem 0', 
            color: 'var(--text-secondary)', 
            fontSize: '0.9rem',
            flex: 1,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical'
          }}>
            {book.description || 'No description available.'}
          </p>
        )}

        {showActions && (
            <div style={{ 
              marginTop: 'auto',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
            onClick={(e) => e.stopPropagation()} // Prevent card click when clicking actions
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  onClick={canRead ? handleRead : handleBuy}
                  disabled={buying}
                  className="btn-primary"
                  style={{
                    padding: '0.45rem 0.8rem',
                    fontSize: '0.85rem',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {canRead ? 'Read' : buying ? 'Processing...' : 'Buy Now'}
                </button>
                <span style={{ 
                  color: '#2563eb', 
                  fontWeight: 'bold', 
                  fontSize: '0.95rem'
                }}>
                  {book.price && book.price > 0 ? `₦${book.price.toLocaleString()}` : 'Free'}
                </span>

                {!canRead && onAddToCart && !isInCart && (
                  <button
                    onClick={handleAddToCart}
                    className="btn-secondary"
                    style={{
                      padding: '0.45rem 0.8rem',
                      fontSize: '0.85rem',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Add to Cart
                  </button>
                )}

                {!canRead && isInCart && !onRemoveFromCart && (
                  <span
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.85rem',
                      fontWeight: 600
                    }}
                  >
                    In Cart
                  </span>
                )}

                {onRemoveFromCart && (
                  <button
                    onClick={handleRemoveFromCart}
                    className="btn-secondary"
                    style={{
                      padding: '0.45rem 0.8rem',
                      fontSize: '0.85rem',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
              
              {showAdminActions && user?.role === 'admin' && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={handleEdit}
                    title="Edit Book"
                    style={{ 
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#3b82f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0.5rem',
                      borderRadius: '4px',
                      transition: 'background 0.2s',
                      fontSize: '0.9rem'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    Edit
                  </button>

                  <button
                    onClick={handleDelete}
                    title="Delete Book"
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer',
                      color: '#ef4444',
                      padding: '0.5rem',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;
