import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { IoGrid } from "react-icons/io5";
import { FaThList } from "react-icons/fa";

console.log("API_BASE from Auth:", API_BASE);
export default function Library() {
  const { token, API_BASE } = useAuth();
  const [library, setLibrary] = useState([]);
  const [filter, setFilter] = useState('all');
  const [view, setView] = useState('grid'); // 'grid' or 'list'
  const navigate = useNavigate();

  async function load() {
    const res = await fetch(`${API_BASE}/api/library`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setLibrary(data);
  }

  useEffect(() => {
    load();
    function onUpdated() {
      load();
    }
    window.addEventListener('bookverse:library:updated', onUpdated);
    return () => window.removeEventListener('bookverse:library:updated', onUpdated);
  }, []);

  async function remove(googleId) {
    await fetch(`${API_BASE}/api/library/remove`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ googleId }),
    });
    load();
  }

  async function markRead(googleId, isRead) {
    await fetch(`${API_BASE}/api/library/mark-read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ googleId, isRead }),
    });
    load();
  }

  // Book counts
  const countAll = library.length;
  const countRead = library.filter(b => (b.status || (b.isRead ? 'read' : 'toBeRead')) === 'read').length;
  const countToBeRead = library.filter(b => (b.status || (b.isRead ? 'read' : 'toBeRead')) === 'toBeRead').length;

  const filteredBooks = library.filter(
    (b) => filter === 'all' || (b.status || (b.isRead ? 'read' : 'toBeRead')) === filter
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-6 min-h-[calc(100vh-120px)]">
      {/* Filters with counts */}
      <div className="flex flex-wrap justify-center gap-3 items-center">
        {[
          { key: 'all', label: `All (${countAll})` },
          { key: 'read', label: `📘 Read (${countRead})` },
          { key: 'toBeRead', label: `🕮 To Be Read (${countToBeRead})` },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-5 py-2 rounded-full text-sm font-medium shadow-sm transition-all ${
              filter === key
                ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-md scale-105'
                : 'bg-white text-gray-700 border hover:bg-blue-50'
            }`}
          >
            {label}
          </button>
        ))}
        {/* View toggle */}
        <div className="ml-auto flex items-center gap-3 bg-white/70 backdrop-blur-md p-2 rounded-xl shadow-md border border-gray-200">
  <button
    onClick={() => setView('grid')}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
      view === 'grid'
        ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-md scale-105'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`}
  >
    <IoGrid className="text-lg" />
    Grid
  </button>
  <button
    onClick={() => setView('list')}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
      view === 'list'
        ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-md scale-105'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`}
  >
    <FaThList className="text-lg" />
    List
  </button>
</div>

      </div>

      {/* Content */}
      {filteredBooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-32">
          <p className="text-gray-500 text-lg mb-4">Your library is feeling empty...</p>
          <button
            onClick={() => navigate('/home')}
            className="px-6 py-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
          >
            Discover Books
          </button>
        </div>
      ) : view === 'grid' ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredBooks.map((b) => (
            <div
              key={b.googleId}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 cursor-pointer flex flex-col overflow-hidden"
              onClick={() => navigate(`/book/${b.googleId}`)}
            >
              {/* Image box */}
              <div className="flex justify-center items-center bg-gray-300 p-4 h-48">
                {b.thumbnail ? (
                  <img
                    src={b.thumbnail}
                    alt={b.title}
                    className="max-h-40 max-w-[90%] object-contain rounded-md"
                  />
                ) : (
                  <div className="h-40 w-28 flex items-center justify-center bg-gray-100 text-gray-400 rounded-md">
                    No Image
                  </div>
                )}
              </div>

              {/* Book details */}
              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg line-clamp-2">{b.title}</h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-1">{(b.authors || []).join(', ')}</p>
                </div>

                <div className="mt-4 flex flex-wrap justify-between items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      (b.status || (b.isRead ? 'read' : 'toBeRead')) === 'read'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {(b.status || (b.isRead ? 'read' : 'toBeRead')) === 'read' ? '📘 Read' : '🕮 To Be Read'}
                  </span>

                  <div className="flex items-center gap-2 text-sm">
                    <label className="flex items-center gap-1 text-gray-700">
                      <input
                        type="checkbox"
                        checked={(b.status || (b.isRead ? 'read' : 'toBeRead')) === 'read'}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => markRead(b.googleId, e.target.checked)}
                      />
                      Mark Read
                    </label>
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        remove(b.googleId);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // List view
        <div className="flex flex-col gap-4">
          {filteredBooks.map((b) => (
            <div
              key={b.googleId}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 cursor-pointer flex flex-row overflow-hidden"
              onClick={() => navigate(`/book/${b.googleId}`)}
            >
              {/* Image */}
              <div className="flex justify-center items-center bg-gray-300 p-4 h-32 w-32">
                {b.thumbnail ? (
                  <img
                    src={b.thumbnail}
                    alt={b.title}
                    className="max-h-28 max-w-full object-contain rounded-md"
                  />
                ) : (
                  <div className="h-28 w-20 flex items-center justify-center bg-gray-100 text-gray-400 rounded-md">
                    No Image
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg line-clamp-2">{b.title}</h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-1">{(b.authors || []).join(', ')}</p>
                  {b.rating && <p className="text-xs text-gray-500 mt-1">⭐ {b.rating}</p>}
                </div>

                <div className="mt-4 flex flex-wrap justify-between items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      (b.status || (b.isRead ? 'read' : 'toBeRead')) === 'read'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {(b.status || (b.isRead ? 'read' : 'toBeRead')) === 'read' ? '📘 Read' : '🕮 To Be Read'}
                  </span>

                  <div className="flex items-center gap-2 text-sm">
                    <label className="flex items-center gap-1 text-gray-700">
                      <input
                        type="checkbox"
                        checked={(b.status || (b.isRead ? 'read' : 'toBeRead')) === 'read'}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => markRead(b.googleId, e.target.checked)}
                      />
                      Mark Read
                    </label>
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        remove(b.googleId);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
