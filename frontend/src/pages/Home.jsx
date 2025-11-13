import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import SearchBar from '../components/SearchBar.jsx';
import GenreDropdown from '../components/GenreDropdown.jsx';
import BookCard from '../components/BookCard.jsx';
import { FaBook, FaStar, FaUserFriends } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import loadingGif from '../assets/loading.gif';
import heroBg from '../assets/Hero-bg.jpg'; 

export default function Home() {
  const { token, API_BASE } = useAuth();
  const [results, setResults] = useState([]);
  const [carouselBooks, setCarouselBooks] = useState([]);
  const [query, setQuery] = useState('bestsellers');
  const [startIndex, setStartIndex] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('All Genres');
  const navigate = useNavigate();

  const searchSectionRef = useRef(null);
  const NAVBAR_HEIGHT = 80;

  async function onSearch(q) {
    setLoading(true);
    const res = await fetch(`${API_BASE}/api/books/search?q=${encodeURIComponent(q)}&startIndex=0`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setResults(data.items || []);
    setCarouselBooks(data.items?.slice(0, 12) || []);
    setQuery(q);
    setStartIndex(data.nextStartIndex || (data.items?.length || 0));
    setTotalItems(data.totalItems || 0);
    setSelectedGenre('All Genres');
    setTimeout(() => setLoading(false), 500);
  }

  useEffect(() => {
    onSearch('bestsellers');
  }, []);

  async function loadMore() {
    const res = await fetch(`${API_BASE}/api/books/search?q=${encodeURIComponent(query)}&startIndex=${startIndex}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setResults((prev) => [...prev, ...(data.items || [])]);
    setStartIndex(data.nextStartIndex || (startIndex + (data.items?.length || 0)));
    setTotalItems(data.totalItems || totalItems);
  }

  const allGenres = results.flatMap((b) => b.genres || []).filter(Boolean);
  const filtered = selectedGenre === 'All Genres'
    ? results
    : results.filter((b) => (b.genres || []).includes(selectedGenre));

  const columnHeight = 600;
  const imageHeight = 200;
  const rowGap = 10;
  const columnWidth = 160; // ✅ consistent column width

  const scrollToSearch = () => {
    if (searchSectionRef.current) {
      const top = searchSectionRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: top - NAVBAR_HEIGHT,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#fffdf8] z-50">
        <img
          src={loadingGif}
          alt="Loading books"
          className="w-64 h-64 object-contain"
        />
      </div>
    );
  }

  return (
    <div className="space-y-16 px-4 md:px-8 py-8 bg-[#fffdf8]">

      {/* Hero Section */}
      <section className="relative h-[600px] rounded-xl overflow-hidden bg-gradient-to-b from-orange-300 to-orange-400 flex items-center justify-center text-white">
        
        {/* Overlay */}
        <img
          src={heroBg}
          alt="Overlay"
          className="absolute inset-0 w-full h-full object-cover opacity-20 z-0"
        />

        {/* Left Column */}
        <div
          className="up"
          style={{
            height: `${columnHeight}px`,
            width: `${columnWidth}px`,
            overflow: 'hidden',
            position: 'absolute',
            left: '5%',
            top: 0,
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, black 20%, black 80%, rgba(0,0,0,0) 100%)',
            zIndex: 1,
          }}
        >
          <div
            className="scroll-container"
            style={{
              display: 'flex',
              flexDirection: 'column',
              animation: `imagescrolling 10s linear infinite`,
            }}
          >
            {[...Array(6)].map((_, i) => {
              const book = carouselBooks[i % carouselBooks.length];
              return (
                <img
                  key={book?.googleId || `left-${i}`}
                  src={book?.thumbnail}
                  alt={book?.title}
                  style={{
                    height: `${imageHeight}px`,
                    marginBottom: `${rowGap}px`,
                    width: '100%',
                    borderRadius: '6px',
                    objectFit: 'cover',
                    opacity: 1,
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Right Column */}
        <div
          className="down"
          style={{
            height: `${columnHeight}px`,
            width: `${columnWidth}px`, 
            overflow: 'hidden',
            position: 'absolute',
            right: '5%',
            top: 0,
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, black 20%, black 80%, rgba(0,0,0,0) 100%)',
            zIndex: 1,
          }}
        >
          <div
            className="scroll-container"
            style={{
              display: 'flex',
              flexDirection: 'column',
              animation: `imagescrolling2 10s linear infinite`,
            }}
          >
            {[...Array(6)].map((_, i) => {
              const book = carouselBooks[(i + 2) % carouselBooks.length];
              return (
                <img
                  key={book?.googleId || `right-${i}`}
                  src={book?.thumbnail}
                  alt={book?.title}
                  style={{
                    height: `${imageHeight}px`,
                    marginBottom: `${rowGap}px`,
                    width: '100%',
                    borderRadius: '6px',
                    objectFit: 'cover',
                    opacity: 1,
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Hero Text */}
        <div className="relative z-10 text-center px-4 md:px-20 space-y-6">
          <h1 className="text-5xl md:text-6xl font-extrabold">
            Step Into the <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">BookVerse</span>
          </h1>
          <p className="text-lg md:text-2xl max-w-3xl mx-auto text-gray-100">
            Discover books, track favorites, and connect with a global community of readers.
          </p>
          <div className="flex justify-center gap-4 mt-6 flex-wrap">
            <button
              onClick={scrollToSearch}
              className="px-6 py-3 bg-white text-blue-500 font-semibold rounded-lg shadow hover:scale-105 transition transform"
            >
              Explore
            </button>
            <button
              onClick={() => navigate('/library')}
              className="px-6 py-3 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-700 text-white font-semibold rounded-lg shadow hover:scale-105 transition transform"
            >
              My Library
            </button>
          </div>
        </div>

        {/* Carousel Keyframes */}
        <style>{`
          @keyframes imagescrolling {
            0% { transform: translateY(0); }
            100% { transform: translateY(-${(imageHeight + rowGap) * 6 - columnHeight}px); }
          }
          @keyframes imagescrolling2 {
            0% { transform: translateY(-${(imageHeight + rowGap) * 6 - columnHeight}px); }
            100% { transform: translateY(0); }
          }
        `}</style>
      </section>

      {/* Quick Stats / Features */}
      <section className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 text-center">
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 flex flex-col items-center">
          <FaBook className="text-indigo-600 text-4xl mb-4" />
          <h3 className="font-semibold text-xl">10M+ Books</h3>
          <p className="text-gray-600">Explore a massive library of books across all genres.</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 flex flex-col items-center">
          <FaStar className="text-amber-500 text-4xl mb-4 " />
          <h3 className="font-semibold text-xl">Add Favorites</h3>
          <p className="text-gray-600">Track your favorite books and personal reading progress.</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 flex flex-col items-center">
          <FaUserFriends className="text-green-500 text-4xl mb-4" />
          <h3 className="font-semibold text-xl">Community</h3>
          <p className="text-gray-600">Connect with readers and discover books through friends.</p>
        </div>
      </section>

      {/* Trending Books Marquee */}
      <section className="relative max-w-full overflow-hidden py-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Trending Books</h2>
        <div className="flex gap-6 animate-marquee">
          {results.slice(0, 12).map((book) => (
            <div key={book.googleId} className="min-w-[160px] flex-shrink-0">
              <BookCard book={book} />
            </div>
          ))}
        </div>
      </section>

      {/* Search & Filter */}
      <section ref={searchSectionRef} className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-full mx-auto">
        <SearchBar onSearch={onSearch} />
        <GenreDropdown genres={allGenres} value={selectedGenre} onChange={setSelectedGenre} />
      </section>

      {/* Books Grid */}
      <section className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 max-w-7xl mx-auto px-6 py-10">
        {filtered.map((b) => (
          <BookCard 
            key={b.googleId} 
            book={b} 
            className="h-full transition-transform transform hover:scale-105 hover:shadow-xl duration-300" 
          />
        ))}
      </section>

      {/* Load More */}
      {startIndex < totalItems && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMore}
            className="px-6 py-2 bg-orange-400 hover:bg-orange-600 text-white rounded-lg shadow transition"
          >
            Load More
          </button>
        </div>
      )}

      {/* Marquee CSS */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          gap: 1.5rem;
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
