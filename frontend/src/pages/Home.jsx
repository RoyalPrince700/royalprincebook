import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import leadingFromWithinImage from '../assets/leadingfromwithin.jpg';
import collegeBlueprintImage from '../assets/collegeblueprint.png';
import academicMasteryImage from '../assets/academicmastery.png';
import uniHackImage from '../assets/unihack.png';
import understandingLoveLanguagesImage from '../assets/understandinglovelanguages.png';
import buildingLastingTrustImage from '../assets/buildinglastingtrust.png';

const getBookCover = (title) => {
  if (!title) return 'https://placehold.co/280x420/e9ecef/333333?text=No+Cover';
  
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('leading from within')) {
    return leadingFromWithinImage;
  } else if (lowerTitle.includes('college') || lowerTitle.includes('blueprint')) {
    return collegeBlueprintImage;
  } else if (lowerTitle.includes('academic') || lowerTitle.includes('mastery')) {
    return academicMasteryImage;
  } else if (lowerTitle.includes('hack') || lowerTitle.includes('uni')) {
    return uniHackImage;
  } else if (lowerTitle.includes('love languages') || lowerTitle.includes('understanding love')) {
    return understandingLoveLanguagesImage;
  } else if (lowerTitle.includes('trust') || lowerTitle.includes('building lasting')) {
    return buildingLastingTrustImage;
  }
  
  return 'https://placehold.co/280x420/e9ecef/333333?text=' + encodeURIComponent(title);
};

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [featuredBook, setFeaturedBook] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      // Make request without Authorization header for public access
      const response = await axios.get('/books', {
        headers: {
          'Authorization': undefined // Explicitly remove auth header for public endpoint
        }
      });
      setBooks(response.data.books);

      // Set featured book (first book or a random popular one)
      if (response.data.books.length > 0) {
        setFeaturedBook(response.data.books[0]);
      }
      setError(''); // Clear any previous errors
    } catch (error) {
      console.error('Failed to fetch books:', error);

      // Provide more specific error messages
      if (error.response?.status === 401) {
        setError('Unable to load books. Please try refreshing the page.');
      } else if (error.response?.status === 404) {
        setError('Books not found. Please check back later.');
      } else if (error.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else {
        setError('Failed to load books. Please check your connection.');
      }

      // Set some fallback demo books for better UX
      setBooks([
        {
          _id: 'demo1',
          title: 'Welcome to Royal Prince Book',
          description: 'Discover amazing stories and knowledge from talented authors.',
          genre: 'Welcome',
          coverImage: 'https://placehold.co/280x420/e9ecef/333333?text=Royal+Prince+Book'
        },
        {
          _id: 'demo2',
          title: 'Coming Soon',
          description: 'More books are being added regularly. Check back soon!',
          genre: 'Preview',
          coverImage: 'https://placehold.co/280x420/e9ecef/333333?text=Coming+Soon'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Group books by genre for Netflix-style rows
  const booksByGenre = books.reduce((acc, book) => {
    const genre = book.genre || 'General';
    if (!acc[genre]) {
      acc[genre] = [];
    }
    acc[genre].push(book);
    return acc;
  }, {});

  // Define genre order: Leadership first, then Relationship, then Academics
  const genreOrder = ['Leadership', 'Relationship', 'Academics'];
  const sortedGenres = Object.keys(booksByGenre).sort((a, b) => {
    const aIndex = genreOrder.indexOf(a);
    const bIndex = genreOrder.indexOf(b);

    // If both genres are in the order array, sort by their position
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    // If only one is in the order array, prioritize it
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    // If neither is in the order array, maintain original order
    return 0;
  });

  // Netflix-style hero section
  const HeroSection = () => {
    // Array of all available book covers for the background collage
    const heroBackgroundImages = [
      leadingFromWithinImage,
      collegeBlueprintImage,
      academicMasteryImage,
      uniHackImage,
      understandingLoveLanguagesImage,
      buildingLastingTrustImage,
      // Repeat to ensure coverage
      leadingFromWithinImage,
      collegeBlueprintImage,
      academicMasteryImage,
      uniHackImage,
      understandingLoveLanguagesImage,
      buildingLastingTrustImage,
    ];
    const heroWallImages = Array.from({ length: 18 }, (_, index) => (
      heroBackgroundImages[index % heroBackgroundImages.length]
    ));

    return (
      <div className="hero-section">
        {/* Netflix-style image wall */}
        <div className="hero-bg-wall" aria-hidden="true">
          {heroWallImages.map((img, index) => (
            <img key={`wall-${index}`} src={img} alt="" />
          ))}
        </div>
        <div className="hero-bg-overlay" aria-hidden="true" />
        <div className="hero-bg-vignette" aria-hidden="true" />

        <div className="container hero-content">
          <h1 className="hero-title">
            Books written to shape how you think and lead.
          </h1>
          <p className="hero-lead">
            Insights on leadership, growth, discipline, and relationships
          </p>
          <p className="hero-sublead">
            crafted to help you become your best self.
          </p>

          <div className="email-form-container">
            <Link to="/all-books">
              <button className="btn-netflix hero-cta" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                <span>Explore My Books</span>
                <span style={{ fontSize: '1.2em' }}>→</span>
              </button>
            </Link>
          </div>
        </div>

        <div className="hero-bottom-curve" aria-hidden="true"></div>
      </div>
    );
   };

  // Netflix-style book row component
  const BookRow = ({ title, books, genre }) => (
    <div style={{ marginBottom: '4rem' }}>
      <h2 className="netflix-row-title">
        {title}
      </h2>
      <div className="netflix-row">
        <div style={{
          display: 'flex',
          gap: '1rem',
          paddingBottom: '1rem'
        }}>
          {books.map(book => (
            <div
              key={book._id}
              className="netflix-book-card"
              style={{
                flexShrink: 0,
                width: '280px',
                height: '420px',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: 'var(--card-bg)',
                cursor: 'pointer',
                position: 'relative'
              }}
              onClick={() => user ? navigate(`/books/${book._id}/read`) : navigate('/register')}
            >
              {/* Book Cover - Full Height */}
              <div className="book-cover" style={{
                width: '100%',
                height: '100%',
                backgroundImage: `url(${getBookCover(book.title)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: 'var(--input-bg)',
                position: 'relative'
              }}>
                {/* Hover Overlay */}
                <div className="book-hover-overlay">
                  <div className="book-info">
                    <h3 style={{
                      fontSize: '1.2rem',
                      fontWeight: '700',
                      marginBottom: '0.5rem',
                      color: 'white',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                    }}>
                      {book.title}
                    </h3>
                    <p style={{
                      fontSize: '0.9rem',
                      opacity: '0.9',
                      margin: 0,
                      color: 'white',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {book.description || 'No description available.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-color)'
      }}>
        <div className="card text-center">
          <h3>Loading amazing books...</h3>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-color)',
      color: 'var(--text-primary)'
    }}>
      {/* Hero Section */}
      <HeroSection />

      {/* Book Rows */}
      <div style={{ marginTop: '2rem' }}>
        {error && (
          <div className="container" style={{ marginBottom: '2rem' }}>
            <div style={{
              color: '#dc3545',
              backgroundColor: '#f8d7da',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #f5c6cb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>{error}</span>
              <button
                onClick={() => {
                  setLoading(true);
                  setError('');
                  fetchBooks();
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {sortedGenres.map(genre => (
          <BookRow
            key={genre}
            title={`${genre} Books`}
            books={booksByGenre[genre]}
            genre={genre}
          />
        ))}

        {books.length === 0 && (
          <div className="container text-center" style={{ padding: '4rem 0' }}>
            <h2>No books available yet</h2>
            <p>Check back soon for new releases!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;