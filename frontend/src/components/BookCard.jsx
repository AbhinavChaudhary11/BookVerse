import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function BookCard({ book }) {
  const { token, API_BASE } = useAuth();
  const [isChooserOpen, setIsChooserOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const overlayRef = useRef(null);

  async function addToLibrary(status) {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/library/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          status,
          book: {
            googleId: book.googleId,
            title: book.title,
            authors: book.authors,
            thumbnail: book.thumbnail,
            rating: book.rating,
            description: book.description,
            previewLink: book.previewLink
          }
        })
      });
      if (res.ok) {
        window.dispatchEvent(new CustomEvent('bookverse:library:updated'));
      }
    } finally {
      setLoading(false);
      setIsChooserOpen(false);
    }
  }

  // Close overlay when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (overlayRef.current && !overlayRef.current.contains(e.target)) {
        setIsChooserOpen(false);
      }
    }
    if (isChooserOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isChooserOpen]);

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.03 }}
      className="bg-white rounded-xl shadow-md p-5 flex flex-col items-center text-center relative transition-all duration-300 hover:shadow-xl"
    >
      {book.thumbnail ? (
        <img
          alt={book.title}
          src={book.thumbnail}
          className="w-32 h-48 object-cover rounded-md shadow-sm mb-3 transition-transform duration-300 hover:scale-105"
        />
      ) : (
        <div className="w-32 h-48 rounded bg-gray-100 text-gray-500 border flex items-center justify-center text-xs">
          No Image
        </div>
      )}

      {/* Title */}
      <h3
        className="font-semibold mt-2 w-full overflow-hidden whitespace-nowrap text-ellipsis hover:animate-scroll-text"
        title={book.title}
      >
        {book.title}
      </h3>

      {/* Author */}
      <p
        className="text-sm text-gray-600 w-full overflow-hidden whitespace-nowrap text-ellipsis hover:animate-scroll-text"
        title={(book.authors || []).join(', ')}
      >
        {(book.authors || []).join(', ')}
      </p>

      {/* Rating */}
      {book.rating && <p className="text-xs text-gray-500 mt-1">⭐ {book.rating}</p>}

      {/* Buttons */}
      <div className="mt-4 flex gap-2 justify-center flex-wrap">
        <Link
          to={`/book/${book.googleId}`}
          className="px-3 py-1 text-sm bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-700 text-white rounded-md transition"
        >
          Details
        </Link>
        <button
          onClick={() => setIsChooserOpen(true)}
          className="px-3 py-1 text-sm bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-700 text-white rounded-md transition"
          disabled={loading}
        >
          Add to Library
        </button>
      </div>

      {/* Library Chooser Overlay */}
      <AnimatePresence>
        {isChooserOpen && (
          <motion.div
            key="lib-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/30 backdrop-blur-sm z-50"
          >
            <motion.div
              ref={overlayRef}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center gap-4 w-52"
            >
              <h4 className="font-semibold text-gray-800 text-center">Add to Library</h4>
              <button
                onClick={() => addToLibrary('toBeRead')}
                className="w-full px-4 py-2 rounded bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-medium"
                disabled={loading}
              >
                🕮 To Be Read
              </button>
              <button
                onClick={() => addToLibrary('read')}
                className="w-full px-4 py-2 rounded bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-700 text-white font-medium"
                disabled={loading}
              >
                📘 Read
              </button>
              <button
                onClick={() => setIsChooserOpen(false)}
                className="w-full px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
