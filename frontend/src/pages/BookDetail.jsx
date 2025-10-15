import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';

export default function BookDetail() {
  const { id } = useParams();
  const { token, API_BASE } = useAuth();
  const [book, setBook] = useState(null);
  const [isChooserOpen, setIsChooserOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch(`${API_BASE}/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBook(data);
    })();
  }, [id]);

  async function addToLibrary(status) {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/library/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status,
          book: {
            googleId: book.googleId,
            title: book.title,
            authors: book.authors,
            thumbnail: book.thumbnail,
            rating: book.rating,
            description: book.description,
            previewLink: book.previewLink,
          },
        }),
      });
      if (res.ok) {
        window.dispatchEvent(new CustomEvent('bookverse:library:updated'));
      }
    } finally {
      setLoading(false);
      setIsChooserOpen(false);
    }
  }

  if (!book)
    return <p className="text-center mt-10 text-gray-600">Loading...</p>;

  const canEmbed = book.previewLink && book.previewLink.includes('output=embed');

  return (
    <div className="relative flex justify-center bg-[#fffdf8] px-4 py-10">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-md p-8 space-y-8 border border-[#f1eadd]">
        {/* Header section */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {book.thumbnail ? (
            <img
              src={book.thumbnail}
              className="w-44 h-64 object-cover rounded-xl shadow-sm border border-[#f3ead9]"
              alt={book.title}
            />
          ) : (
            <div className="w-44 h-64 flex items-center justify-center bg-gray-100 rounded-xl shadow-sm text-gray-400 border border-[#f3ead9]">
              No Image
            </div>
          )}

          <div className="flex-1 space-y-4 px-10 py-14">
            <div>
              <h1 className="text-3xl font-semibold text-gray-800 leading-snug">
                {book.title}
              </h1>
              <p className="text-gray-600 text-lg mt-1">
                {(book.authors || []).join(', ')}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {canEmbed ? (
                <div className="w-full md:w-80 h-96 border rounded-lg overflow-hidden shadow-inner">
                  <iframe
                    src={book.previewLink}
                    width="100%"
                    height="100%"
                    className="border-0"
                    allowFullScreen
                    title="Book Preview"
                  />
                </div>
              ) : (
                <button
                  onClick={() => window.open(book.previewLink, '_blank')}
                  className="px-4 py-2 bg-blue-500 hover:bg-amber-500 text-white rounded-lg transition font-medium shadow-sm"
                >
                  Preview
                </button>
              )}

              <button
                onClick={() =>
                  window.open(
                    `https://www.amazon.in/s?k=${encodeURIComponent(
                      `${book.title} ${(book.authors || [])[0] || ''}`
                    )}`,
                    '_blank'
                  )
                }
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition font-medium shadow-sm"
              >
                Buy on Amazon
              </button>
              <button
                onClick={() => setIsChooserOpen(true)}
                disabled={loading}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition font-medium shadow-sm"
              >
                Add to Library
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-[#fffaf0] border border-[#f3ead9] p-5 rounded-xl shadow-inner max-h-[450px] overflow-y-auto text-gray-700 leading-relaxed">
          <div dangerouslySetInnerHTML={{ __html: book.description }}></div>
        </div>
      </div>

      {/* Overlay  */}
      <AnimatePresence>
        {isChooserOpen && (
          <motion.div
            key="lib-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            onClick={() => setIsChooserOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="bg-white rounded-xl shadow-lg p-6 flex items-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => addToLibrary('toBeRead')}
                className="px-4 py-2 rounded bg-amber-500 text-white font-medium shadow-sm hover:bg-amber-600"
                disabled={loading}
              >
                To Be Read
              </button>
              <button
                onClick={() => addToLibrary('read')}
                className="px-4 py-2 rounded bg-emerald-500 text-white font-medium shadow-sm hover:bg-emerald-600"
                disabled={loading}
              >
                Read
              </button>
              <button
                onClick={() => setIsChooserOpen(false)}
                className="px-3 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
