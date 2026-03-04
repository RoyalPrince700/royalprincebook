import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BookCard from '../components/Book/BookCard';

// Apple Standard Hero Image (PNG with transparent background)
import leadingFromWithinImage from '../assets/leadingfromwithin.jpg';

const Home = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('/books');
        
        setFeaturedBooks((response.data.books || []).slice(0, 4));
      } catch (error) {
        console.error('Failed to fetch books:', error);
        setFeaturedBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-[#1d1d1f] font-sans selection:bg-blue-200">
      
      {/* Apple-style Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden text-center">
        <div className="max-w-5xl mx-auto z-10 relative">
          
          {/* Typography */}
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-[#1d1d1f] mb-4 leading-tight">
            Master Your Life & Leadership.
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-gray-500 font-normal max-w-2xl mx-auto leading-relaxed">
            Insights on growth, discipline, and relationships. <br className="hidden md:block" />
            Crafted to help you become your best self.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/all-books"
              className="px-6 py-2.5 rounded-full bg-[#0071e3] text-white !text-white text-base font-medium hover:bg-[#0077ed] transition-colors duration-200 min-w-[120px]"
            >
              Start Reading
            </Link>
            <Link
              to="/register"
              className="group flex items-center text-[#0071e3] text-base font-medium hover:underline px-4"
            >
              Join Community <span className="ml-1 group-hover:translate-x-0.5 transition-transform">›</span>
            </Link>
          </div>

          {/* Hero Image - The Book */}
          <div className="mt-16 md:mt-20 relative flex justify-center">
             {/* Subtle Apple-style glow/shadow behind the book */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-b from-blue-50/50 to-transparent blur-3xl -z-10 rounded-full opacity-60 pointer-events-none"></div>
             
             <img
              src={leadingFromWithinImage}
              alt="Leading From Within"
              className="w-full max-w-[280px] sm:max-w-sm md:max-w-md lg:max-w-lg object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>
        </div>
      </section>

      {/* Features/Value Prop (Clean & Minimal) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-[#1d1d1f] tracking-tight">
              Knowledge tailored for growth.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {/* Feature 1 */}
            <div className="flex flex-col items-center">
               <div className="mb-4 text-gray-900">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
               </div>
               <h3 className="text-xl font-semibold text-[#1d1d1f] mb-2">Global Perspective</h3>
               <p className="text-gray-500 leading-relaxed max-w-xs">
                 Books that bridge cultures and concepts to provide universal lessons.
               </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center">
               <div className="mb-4 text-gray-900">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
               </div>
               <h3 className="text-xl font-semibold text-[#1d1d1f] mb-2">Actionable Insights</h3>
               <p className="text-gray-500 leading-relaxed max-w-xs">
                 Practical frameworks you can apply immediately, not just theory.
               </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center">
               <div className="mb-4 text-gray-900">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
               </div>
               <h3 className="text-xl font-semibold text-[#1d1d1f] mb-2">Premium Library</h3>
               <p className="text-gray-500 leading-relaxed max-w-xs">
                 A growing collection of exclusive titles available only here.
               </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="bg-[#f5f5f7] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-semibold text-[#1d1d1f]">Featured Books</h2>
            <Link to="/all-books" className="text-[#0071e3] hover:underline font-medium text-sm flex items-center">
              View all <span className="ml-1">›</span>
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
              {featuredBooks.map((book) => (
                <div key={book._id} className="group">
                   <BookCard 
                    book={book} 
                    showDescription={false}
                    showActions={true}
                    showAdminActions={false}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Clean CTA Section */}
      <section className="bg-white py-24">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-4xl font-semibold text-[#1d1d1f] mb-6">
            Ready to start your journey?
          </h2>
          <p className="text-xl text-gray-500 mb-10">
            Join the community today and unlock your potential.
          </p>
          <div className="flex justify-center gap-4">
             <Link
              to="/register"
              className="px-8 py-3 rounded-full bg-[#0071e3] text-white !text-white font-medium hover:bg-[#0077ed] transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
